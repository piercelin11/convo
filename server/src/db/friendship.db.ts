import { dbQuery } from "@/utils/index.js";
import { FriendshipDto, FriendshipDtoSchema } from "@convo/shared";
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
