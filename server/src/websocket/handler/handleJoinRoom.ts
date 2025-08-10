import { JoinRoomPayloadSchemaType } from "@convo/shared";
import { WebSocket } from "ws";
import { roomConnections } from "../wss.js";

export default function handleJoinRoom(
	ws: WebSocket,
	payload: JoinRoomPayloadSchemaType
) {
	const { roomId } = payload;
	if (!roomConnections.has(roomId)) {
		roomConnections.set(roomId, new Set());
	}

	const room = roomConnections.get(roomId);

	if (room) {
		room.add(ws);
		ws.currentRoomId = roomId;
	}
}
