import { JoinRoomPayloadSchemaType } from "@convo/shared";
import { acvtiveRoomViewers } from "../wss.js";

export default async function handleJoinRoom(
	payload: JoinRoomPayloadSchemaType
) {
	const { userId, roomId } = payload;
	acvtiveRoomViewers.set(userId, roomId);
}
