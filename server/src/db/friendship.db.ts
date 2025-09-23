import { dbQuery } from "@/utils/index.js";
import {
	FriendshipDto,
	FriendshipDtoSchema,
	FriendshipRecord,
	FriendshipRecordSchema,
	FriendshipStatus,
} from "@convo/shared";
import { z } from "zod/v4";

/**
 * 根據用戶ID查詢該用戶的所有好友關係。
 *
 * @param userId - 用戶的唯一識別碼 (UUID)。
 * @returns 包含所有找到的好友DTOs陣列，這些關係的狀態為 'accepted'。
 */
export async function findFriendshipsByUserId(
	userId: string
): Promise<FriendshipDto[]> {
	const query = `
        SELECT 
            u.id,
            u.username,
            u.email,
            u.avatar_url,
            f.status AS friendship_status
        FROM friendships AS f
        JOIN users AS u
        ON 
            (f.requester_id = $1 AND f.addressee_id = u.id) 
            OR 
            (f.addressee_id = $1 AND f.requester_id = u.id)
        WHERE 
            f.status = 'accepted'
            AND
            (f.requester_id = $1 OR f.addressee_id = $1)`;
	const values = [userId];

	const result = await dbQuery<FriendshipDto>(query, values);
	const frienships = result.rows;
	return z.array(FriendshipDtoSchema).parse(frienships);
}

interface CreateFriendshipParams {
	requesterId: string;
	addresseeId: string;
	status: FriendshipStatus;
}

/**
 * 在資料庫中建立一筆新的好友關係紀錄
 */
export async function createFriendship({
	requesterId,
	addresseeId,
	status,
}: CreateFriendshipParams): Promise<FriendshipRecord> {
	const query = `
    INSERT INTO friendships (requester_id, addressee_id, status)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
	const values = [requesterId, addresseeId, status];

	const result = await dbQuery<FriendshipRecord>(query, values);
	const newFriendship = result.rows[0];

	return FriendshipRecordSchema.parse(newFriendship);
}

interface FindFriendshipParams {
	userId1: string;
	userId2: string;
}

/**
 * 查找兩個使用者之間是否存在任何方向的好友關係
 * @returns 返回找到的第一筆關係紀錄，如果不存在則返回 undefined
 */
export async function findFriendshipBetweenUsers({
	userId1,
	userId2,
}: FindFriendshipParams): Promise<FriendshipRecord | undefined> {
	const query = `
    SELECT * FROM friendships
    WHERE (requester_id = $1 AND addressee_id = $2)
       OR (requester_id = $2 AND addressee_id = $1);
  `;
	// 修正：為每一個佔位符提供一個單獨的值
	const values = [userId1, userId2];

	const result = await dbQuery<FriendshipRecord>(query, values);
	const friendship = result.rows[0];

	// 使用 .optional() 是因為如果找不到紀錄，friendship 會是 undefined
	return FriendshipRecordSchema.optional().parse(friendship);
}

/**
 * 根據 ID 更新好友關係的狀態
 */
interface UpdateFriendshipStatusParams {
	requesterId: string;
	addresseeId: string;
	status: FriendshipStatus;
}

export async function updateFriendshipStatusById({
	requesterId,
	addresseeId,
	status,
}: UpdateFriendshipStatusParams): Promise<FriendshipRecord> {
	const query = `
    UPDATE friendships
    SET status = $1
    WHERE requester_id = $2 AND addressee_id = $3
    RETURNING *;
  `;

	// 修正後的參數：依照 SQL 語句的佔位符順序傳遞
	const values = [status, requesterId, addresseeId];

	const result = await dbQuery<FriendshipRecord>(query, values);
	const updatedFriendship = result.rows[0];

	return FriendshipRecordSchema.parse(updatedFriendship);
}

/**
 * 根據 requester 和 addressee 刪除一筆好友關係紀錄
 */

interface DeleteFriendshipParams {
	requesterId: string;
	addresseeId: string;
}

export async function deleteFriendship({
	requesterId,
	addresseeId,
}: DeleteFriendshipParams): Promise<void> {
	const query = `
    DELETE FROM friendships
    WHERE requester_id = $1 AND addressee_id = $2;
  `;
	const values = [requesterId, addresseeId];

	await dbQuery(query, values);
}

/**
 * 查找指定使用者收到的所有待處理的好友邀請
 */

export async function findPendingRequestsForUser(
	addresseeId: string
): Promise<FriendshipRecord[]> {
	const query = `
    SELECT * FROM friendships
    WHERE addressee_id = $1 AND status = 'pending'
	ORDER BY created_at DESC;
  `;

	const values = [addresseeId];
	const result = await dbQuery<FriendshipRecord>(query, values);
	return FriendshipRecordSchema.array().parse(result.rows);
}

/**
 * 根據使用者名稱搜尋待處理的好友邀請
 */

interface SearchPendingRequestsParams {
	userId: string;
	query: string;
}

export async function searchPendingRequests({
	userId,
	query,
}: SearchPendingRequestsParams): Promise<FriendshipRecord[]> {
	const searchTerm = `%${query}%`;
	const sqlQuery = `
	SELECT
      f.requester_id,
      f.addressee_id,
      f.status,
      f.created_at,
      f.updated_at
    FROM friendships f
    JOIN users u ON f.requester_id = u.id
    WHERE f.addressee_id = $1
      AND f.status = 'pending'
      AND u.username ILIKE $2
    ORDER BY f.created_at DESC;
	`;
	const values = [userId, searchTerm];
	const result = await dbQuery<FriendshipRecord>(sqlQuery, values);
	return FriendshipRecordSchema.array().parse(result.rows);
}
