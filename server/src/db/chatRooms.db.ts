import pool from "@/config/database.js";
import { DatabaseError } from "@/utils/index.js";
import { ChatRoomRecord } from "@convo/shared";

export async function findChatRoomByUserId(
	userId: string
): Promise<ChatRoomRecord[]> {
	const query = `
        SELECT * 
        FROM 
            chat_rooms as cr 
        JOIN 
            room_members AS rm ON cr.id = rm.room_id
        WHERE 
            rm.user_id = $1
        `;
	const values = [userId];

	try {
		const result = await pool.query(query, values);
		const chatRooms = result.rows;
		return chatRooms;
	} catch (error) {
		console.error(
			`[db]: 獲取使用者 id 為 ${userId} 的聊天室時發生錯誤:`,
			error
		);
		throw new DatabaseError(
			`獲取使用者 id 為 ${userId} 的聊天室時發生錯誤`,
			false,
			{
				cause: error,
			}
		);
	}
}
