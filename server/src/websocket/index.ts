import { authenticateAuthToken, AuthenticationError } from "@/utils/index.js";
import { ErrorMessageSchemaType, InboundMessageSchema } from "@convo/shared";
import cookie from "cookie";
import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { z, ZodError } from "zod/v4";
import handleJoinRoom from "./handler/handleJoinRoom.js";
import handleSendChat from "./handler/handleSendChat.js";
import handleLeaveRoom from "./handler/handleLeaveRoom.js";

export default function initializeWebSocket(server: Server) {
	const wss = new WebSocketServer({ server });
	const roomsMap = new Map<string, Set<WebSocket>>();

	wss.on("connection", (ws: WebSocket, req) => {
		const cookieString = req.headers.cookie || "";
		const cookies = cookie.parse(cookieString);
		const token = cookies.authToken;

		try {
			authenticateAuthToken(token);
		} catch (error) {
			if (error instanceof AuthenticationError) {
				const errorMessage: ErrorMessageSchemaType = {
					event: "ERROR",
					payload: {
						message: `使用者身份驗證失敗: ${error.message}`,
					},
				};
				ws.send(JSON.stringify(errorMessage));
			} else {
				const errorMessage: ErrorMessageSchemaType = {
					event: "ERROR",
					payload: {
						message: "發生未預期的錯誤，使用者身份驗證失敗",
					},
				};
				ws.send(JSON.stringify(errorMessage));
			}
			console.error("[WebSocket]身份驗證失敗。", error);
			ws.close(1008, "身份驗證失敗");
		}

		ws.on("message", (message) => {
			const messageString = message.toString();

			try {
				const message = JSON.parse(messageString);
				const validatedData = InboundMessageSchema.parse(message);

				switch (validatedData.type) {
					case "JOIN_ROOM": {
						handleJoinRoom(ws, roomsMap, validatedData.payload);
						break;
					}
					case "LEAVE_ROOM": {
						handleLeaveRoom(ws, roomsMap);
						break;
					}
					case "SEND_CHAT": {
						handleSendChat(ws, roomsMap, validatedData.payload);
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
			const { currentRoomId } = ws;
			if (currentRoomId) {
				const room = roomsMap.get(currentRoomId);
				if (room) {
					room.delete(ws);
					if (room.size === 0) {
						roomsMap.delete(currentRoomId);
					}
				}
			}
		});
	});
}
