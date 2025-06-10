import pool from "@/config/database.js";
import { BadRequestError, DatabaseError } from "@/utils/index.js";
import { ChatRoomRecord } from "@convo/shared";

export async function findChatRoomsByUserId(
	userId: string
): Promise<ChatRoomRecord[]> {
	const query = `
        SELECT * 
        FROM chat_rooms as cr 
        JOIN room_members AS rm 
		ON cr.id = rm.room_id
        WHERE rm.user_id = $1
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
		if (
			error instanceof Error &&
			"code" in error &&
			error.code === "ENOTFOUND"
		) {
			console.error("[chatDb]檢查網路連線或資料庫連結是否正確");
			throw new DatabaseError(`發生未預期錯誤，請檢查網路是否正確連線`, true, {
				cause: error,
			});
		} else
			throw new DatabaseError(
				`獲取使用者 id 為 ${userId} 的聊天室時發生錯誤`,
				false,
				{
					cause: error,
				}
			);
	}
}

export async function findChatRoomByRoomId(
	roomId: string
): Promise<ChatRoomRecord> {
	const query = `
        SELECT * 
        FROM chat_rooms
        WHERE id = $1
        `;
	const values = [roomId];

	try {
		const result = await pool.query(query, values);
		const chatRoom = result.rows[0];
		return chatRoom;
	} catch (error) {
		console.error(
			`[chatDb]: 獲取聊天室 id 為 ${roomId} 的聊天室時發生錯誤:`,
			error
		);
		if (
			error instanceof Error &&
			"code" in error &&
			error.code === "ENOTFOUND"
		) {
			console.error("[chatDb]檢查網路連線或資料庫連結是否正確");
			throw new DatabaseError(`發生未預期錯誤，請檢查網路是否正確連線`, true, {
				cause: error,
			});
		} else
			throw new DatabaseError(
				`獲取聊天室 id 為 ${roomId} 的聊天室時發生錯誤`,
				false,
				{
					cause: error,
				}
			);
	}
}

export async function createGroupChat(
	name: string,
	creatorId: string,
	members: string[]
): Promise<ChatRoomRecord> {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const creatChatRoomQuery = `
			INSERT INTO chat_rooms (name, type, creator_id)
			VALUES ($1, 'group', $2)
			RETURNING *
		`;
		const result = await client.query(creatChatRoomQuery, [name, creatorId]);
		const chatRoomId = result.rows[0].id;

		const memberValues: string[] = [];
		const memberPlaceholder: string[] = [];
		let placeholderndex = 1;

		if (!members.includes(creatorId))
			throw new BadRequestError("[chatRoomDB]創建者 id 須包含在成員 id 中");

		members.forEach((memberId) => {
			memberValues.push(chatRoomId, memberId);
			memberPlaceholder.push(`($${placeholderndex++}, $${placeholderndex++})`);
		});

		const creatRoomMembersQuery = `
			INSERT INTO room_members (room_id, user_id)
			VALUES ${memberPlaceholder}`;
		await client.query(creatRoomMembersQuery, memberValues);
		await client.query("COMMIT");

		return result.rows[0];
	} catch (error) {
		await client.query("ROLLBACK");
		console.error(
			`[chatRoomDB]: 使用者 ${creatorId} 在建立名稱為 ${name} 的聊天室時發生錯誤:`,
			error
		);
		if (
			error instanceof Error &&
			"code" in error &&
			error.code === "ENOTFOUND"
		) {
			console.error("[chatDb]檢查網路連線或資料庫連結是否正確");
			throw new DatabaseError(`發生未預期錯誤，請檢查網路是否正確連線`, true, {
				cause: error,
			});
		} else
			throw new DatabaseError(
				`使用者 ${creatorId} 在建立名稱為 ${name} 的聊天室時發生錯誤`,
				false,
				{
					cause: error,
				}
			);
	}
}

export async function deleteChatRoomByRoomId(roomId: string) {
	const query = `
	DELETE FROM chat_rooms
	WHERE id = $1
	RETURNING *
	`;
	const values = [roomId];

	try {
		const result = await pool.query(query, values);
		const chatRoom = result.rows[0];
		return chatRoom;
	} catch (error) {
		console.error(
			`[chatDb]: 刪除聊天室 id 為 ${roomId} 的聊天室時發生錯誤:`,
			error
		);
		if (
			error instanceof Error &&
			"code" in error &&
			error.code === "ENOTFOUND"
		) {
			console.error("[chatDb]檢查網路連線或資料庫連結是否正確");
			throw new DatabaseError(`發生未預期錯誤，請檢查網路是否正確連線`, true, {
				cause: error,
			});
		} else
			throw new DatabaseError(
				`刪除聊天室 id 為 ${roomId} 的聊天室時發生錯誤`,
				false,
				{
					cause: error,
				}
			);
	}
}
