import { JoinRoomPayloadSchemaType } from "@convo/shared";
import { WebSocket } from "ws";

declare module "ws" {
	interface WebSocket {
		currentRoomId?: string;
	}
}

export default function handleJoinRoom(
	ws: WebSocket,
	roomsMap: Map<string, Set<WebSocket>>,
	payload: JoinRoomPayloadSchemaType
) {
	const { roomId } = payload;
	if (!roomsMap.has(roomId)) {
		roomsMap.set(roomId, new Set());
	}

	const room = roomsMap.get(roomId);

	if (room) {
		room.add(ws);
		ws.currentRoomId = roomId;
	}
}
