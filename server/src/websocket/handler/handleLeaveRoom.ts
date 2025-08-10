import WebSocket from "ws";
import { roomConnections } from "../wss.js";

export default function handleLeaveRoom(ws: WebSocket) {
	const { currentRoomId } = ws;
	if (currentRoomId) {
		const room = roomConnections.get(currentRoomId);
		if (room) {
			room.delete(ws);
			if (room.size === 0) {
				roomConnections.delete(currentRoomId);
			}
		}
	}
}
