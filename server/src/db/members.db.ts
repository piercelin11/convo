import { dbQuery } from "@/utils/index.js";
import { RoomMemberRecord, RoomMemberRecordSchema } from "@convo/shared";

export async function updateLastReadAt(
	roomId: string,
	userId: string
): Promise<RoomMemberRecord> {
	const query = `
    UPDATE room_members
    SET last_read_at = $1
    WHERE room_id = $2 AND user_id = $3
    RETURNING *
    `;
	const values = [new Date(), roomId, userId];

	const result = await dbQuery<RoomMemberRecord>(query, values);
	const roomMember = result.rows[0];

	return RoomMemberRecordSchema.parse(roomMember);
}
