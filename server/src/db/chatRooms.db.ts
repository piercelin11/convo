import { dbQuery, dbTransaction } from "@/utils/index.js";
import { BadRequestError } from "@/utils/index.js";
import {
	ChatRoomRecord,
	ChatRoomRecordSchema,
	ChatRoomWithMembersDto,
	ChatRoomWithMembersDtoSchema,
} from "@convo/shared";
import { z } from "zod/v4";

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
	const chatRooms = result.rows;

	return z.array(ChatRoomRecordSchema).parse(chatRooms);
}

export async function findChatRoomsByImgUrl(
	imgUrl: string
): Promise<ChatRoomRecord[]> {
	const query = `
        SELECT * 
        FROM chat_rooms
        WHERE image_url = $1
        `;
	const values = [imgUrl];
	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRooms = result.rows;

	return z.array(ChatRoomRecordSchema).parse(chatRooms);
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
	return ChatRoomRecordSchema.parse(chatRoom);
}

export async function findChatRoomWithMembersByRoomId(
	roomId: string
): Promise<ChatRoomWithMembersDto | undefined> {
	const query = `
        SELECT
            cr.id AS id,
            cr.name AS name,
            cr.type AS type,
            cr.creator_id AS creator_id,
            cr.created_at AS created_at,
            cr.updated_at AS updated_at,
            cr.image_url AS image_url,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', u.id,
                    'username', u.username,
                    'joined_at', rm.joined_at,
					'avatar_url', u.avatar_url,
					'age', u.age,
					'email', u.email
                ) ORDER BY u.username
            ) AS members
        FROM
            chat_rooms cr
        JOIN
            room_members rm ON cr.id = rm.room_id
        JOIN
            users u ON rm.user_id = u.id
        WHERE
            cr.id = $1
        GROUP BY
            cr.id
        ;
    `;
	const values = [roomId];

	const result = await dbQuery<ChatRoomWithMembersDto>(query, values); // 這裡的 any 需要更精確的型別，因為有 JSON_AGG
	const chatRoomWithMembers = result.rows[0];

	if (!chatRoomWithMembers) {
		return undefined;
	}

	return ChatRoomWithMembersDtoSchema.parse(chatRoomWithMembers);
}

export async function createChatRoom(
	name: string,
	creatorId: string,
	members: string[],
	img?: string | null
): Promise<ChatRoomRecord> {
	const chatRoom = await dbTransaction<ChatRoomRecord>(async (client) => {
		const creatChatRoomQuery = `
			INSERT INTO chat_rooms (name, type, creator_id, image_url)
			VALUES ($1, 'group', $2, $3)
			RETURNING *
		`;
		const result = await client.query(creatChatRoomQuery, [
			name,
			creatorId,
			img,
		]);
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

	return ChatRoomRecordSchema.parse(chatRoom);
}

export async function updateChatRoomData(
	roomId: string,
	name: string,
	imgUrl?: string | null
): Promise<ChatRoomRecord> {
	const query = `
	UPDATE chat_rooms
	SET name = $1, image_url = $2
	WHERE id = $3
	RETURNING *
	`;
	const values = [name, imgUrl, roomId];

	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRoom = result.rows[0];

	return ChatRoomRecordSchema.parse(chatRoom);
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
	return ChatRoomRecordSchema.parse(chatRoom);
}
