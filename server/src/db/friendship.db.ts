import pool from "@/config/database.js";
import { DatabaseError } from "@/utils/index.js";
import { FriendshipDto } from "@convo/shared";

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

	try {
		const result = await pool.query(query, values);
		const frienships = result.rows;
		return frienships;
	} catch (error) {
		console.error(
			`[db]: 獲取使用者 id 為 ${userId} 的好友關係時發生錯誤:`,
			error
		);
		throw new DatabaseError(
			`獲取使用者 id 為 ${userId} 的好友關係時發生錯誤`,
			false,
			{
				cause: error,
			}
		);
	}
}
