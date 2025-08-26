import { dbQuery } from "@/utils/index.js";
import { RoomMemberRecord, RoomMemberRecordSchema } from "@convo/shared";

/**
 * 為特定房間內的單個使用者批次更新 last_read_at 時間戳
 * @param roomId - 目標房間的 ID
 * @param userId - 需要更新的使用者 ID
 * @returns 該成員資料
 */
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

/**
 * 為特定房間內的多個使用者批次更新 last_read_at 時間戳
 * @param userIds - 需要更新的使用者 ID 陣列
 * @param roomId - 目標房間的 ID
 */
export async function updateLastReadForUsersInRoom(
	userIds: string[],
	roomId: string
): Promise<void> {
	if (userIds.length === 0) {
		return;
	}

	const query = `
    UPDATE room_members
    SET last_read_at = $1
    WHERE
      user_id = ANY($2::uuid[]) AND
      room_id = $3
  `;

	const values = [new Date(), userIds, roomId];
	await dbQuery<RoomMemberRecord>(query, values);
}
