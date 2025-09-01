import {
	JoinRoomPayloadSchemaType,
	OutboundMessageSchemaType,
} from "@convo/shared";
import { acvtiveRoomViewers, roomConnections } from "../wss.js";
import * as membersDB from "@/db/members.db.js";

export default async function handleJoinRoom(
	payload: JoinRoomPayloadSchemaType
) {
	const { userId, roomId } = payload;
	await membersDB.updateLastReadAt(roomId, userId);

	const room = roomConnections.get(roomId);
	if (!room) {
		console.error("[handleSendChat]沒有找到相符的聊天室");
		return;
	}

	const data: OutboundMessageSchemaType = {
		event: "READ_ROOM",
		payload: {
			roomId,
		},
	};
	room.forEach((ws) => {
		const member = ws.user;
		if (member && acvtiveRoomViewers.get(member.id) == roomId) {
			ws.send(JSON.stringify(data));
		}
	});
	acvtiveRoomViewers.set(userId, roomId);
}
