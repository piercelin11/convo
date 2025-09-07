import { authenticateAuthToken, dbQuery } from "@/utils/index.js";
import { ErrorMessageSchemaType, InboundMessageSchema } from "@convo/shared";
import cookie from "cookie";
import { Server } from "http";
import { WebSocket } from "ws";
import { z, ZodError } from "zod/v4";
import handleSendChat from "./handler/handleSendChat.js";
import {
	wss,
	userConnections,
	roomConnections,
	acvtiveRoomViewers,
} from "./wss.js";
import { UserPayloadType } from "@/middlewares/authenticateToken.js";
import handleJoinRoom from "./handler/handleJoinRoom.js";
import handleLeaveRoom from "./handler/handleLeaveRoom.js";

export default function initializeWebSocket(server: Server) {
	server.on("upgrade", (req, socket, head) => {
		const cookieString = req.headers.cookie || "";
		const cookies = cookie.parse(cookieString);
		const token = cookies.authToken;
		let user: UserPayloadType | null = null;

		try {
			user = authenticateAuthToken(token);
		} catch (error) {
			console.error("[WebSocket]身份驗證失敗。", error);
			socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
			socket.destroy();
			return;
		}

		wss.handleUpgrade(req, socket, head, (ws) => {
			wss.emit("connection", ws, user);
		});
	});

	wss.on("connection", async (ws: WebSocket, user: UserPayloadType) => {
		if (!userConnections.has(user.id)) userConnections.set(user.id, ws);
		ws.user = user;
		ws.isAlive = true;

		const userRoomsResult = await dbQuery<{ room_id: string }>(
			"SELECT room_id FROM room_members WHERE user_id = $1",
			[user.id]
		);

		const roomIds = userRoomsResult.rows.map((row) => row.room_id);

		roomIds.forEach((roomId) => {
			if (!roomConnections.has(roomId)) {
				roomConnections.set(roomId, new Set<WebSocket>());
			}
			roomConnections.get(roomId)!.add(ws);
		});

		ws.subscribedRoomIds = roomIds;

		ws.on("message", (message) => {
			const messageString = message.toString();

			try {
				const message = JSON.parse(messageString);
				const validatedData = InboundMessageSchema.parse(message);

				switch (validatedData.type) {
					case "SEND_CHAT": {
						handleSendChat(validatedData.payload);
						break;
					}
					case "JOIN_ROOM": {
						handleJoinRoom(validatedData.payload);
						break;
					}
					case "LEAVE_ROOM": {
						handleLeaveRoom(validatedData.payload);
						break;
					}
				}
			} catch (error) {
				if (error instanceof SyntaxError) {
					console.error(
						"[WebSocket]JSON 解析錯誤：收到了無效的 JSON 格式字串。",
						error.message
					);
					const errorMessage: ErrorMessageSchemaType = {
						event: "ERROR",
						payload: {
							message: "收到了無效的 JSON 格式字串",
						},
					};
					ws.send(JSON.stringify(errorMessage));
				} else if (error instanceof ZodError) {
					const fieldError = z.flattenError(error).fieldErrors;
					console.error("[WebSocket]傳入伺服器的 WebSocket 訊息結構錯誤", {
						error: fieldError,
						inboundMessage: JSON.parse(messageString),
					});
					const errorMessage: ErrorMessageSchemaType = {
						event: "ERROR",
						payload: {
							message: "傳入伺服器的訊息結構錯誤",
						},
					};
					ws.send(JSON.stringify(errorMessage));
				} else {
					console.error(
						"[WebSocket]解析 WebSocket 訊息時出現未預期錯誤。",
						error
					);
					const errorMessage: ErrorMessageSchemaType = {
						event: "ERROR",
						payload: {
							message: "發生未預期的錯誤",
						},
					};
					ws.send(JSON.stringify(errorMessage));
				}
			}
		});

		ws.on("close", () => {
			const closedUser = ws.user;
			if (closedUser) {
				userConnections.delete(closedUser.id);
				acvtiveRoomViewers.delete(closedUser.id);

				const subscribedRoomIds = ws.subscribedRoomIds || [];
				subscribedRoomIds.forEach((roomId) => {
					const room = roomConnections.get(roomId);
					if (room) {
						room.delete(ws);
						if (room.size === 0) {
							roomConnections.delete(roomId);
						}
					}
				});
			}
		});

		ws.on("pong", () => {
			ws.isAlive = true;
		});
	});

	const interval = setInterval(() => {
		wss.clients.forEach((ws) => {
			if (ws.isAlive === false) {
				return ws.terminate();
			}
			ws.isAlive = false;
			ws.ping();
		});
	}, 30000);

	wss.on("close", () => {
		clearInterval(interval);
	});
}
