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
		if (
			error instanceof Error &&
			"code" in error &&
			error.code === "ENOTFOUND"
		) {
			console.error("[friendshipDb]檢查網路連線或資料庫連結是否正確");
			throw new DatabaseError(`發生未預期錯誤，請檢查網路是否正確連線`, true, {
				cause: error,
			});
		} else
			throw new DatabaseError(
				`獲取使用者 id 為 ${userId} 的好友關係時發生錯誤`,
				false,
				{
					cause: error,
				}
			);
	}
}
