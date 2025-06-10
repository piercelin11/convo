import { dbQuery, dbTransaction } from "@/utils/index.js";
import { BadRequestError } from "@/utils/index.js";
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
	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRoom = result.rows;

	return chatRoom;
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

	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRoom = result.rows[0];
	return chatRoom;
}

export async function createGroupChat(
	name: string,
	creatorId: string,
	members: string[]
): Promise<ChatRoomRecord> {
	const result = await dbTransaction<ChatRoomRecord>(async (client) => {
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

		return result.rows[0];
	});

	return result;
}

export async function deleteChatRoomByRoomId(roomId: string) {
	const query = `
	DELETE FROM chat_rooms
	WHERE id = $1
	RETURNING *
	`;
	const values = [roomId];

	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRoom = result.rows[0];
	return chatRoom;
}
