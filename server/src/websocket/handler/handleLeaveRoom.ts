import { LeaveRoomPayloadSchemaType } from "@convo/shared";
import { acvtiveRoomViewers } from "../wss.js";

export default async function handleLeaveRoom(
	payload: LeaveRoomPayloadSchemaType
) {
	const { userId } = payload;
	acvtiveRoomViewers.delete(userId);
}
