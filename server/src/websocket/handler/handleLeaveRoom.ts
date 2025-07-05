import WebSocket from "ws";

export default function handleLeaveRoom(
	ws: WebSocket,
	roomsMap: Map<string, Set<WebSocket>>
) {
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
}
