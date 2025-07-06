import { dbQuery, dbTransaction } from "@/utils/index.js";
import {
	ChatRoomRecord,
	ChatRoomRecordSchema,
	ChatRoomWithMembersDto,
	ChatRoomWithMembersDtoSchema,
	ChatRoomWithMessagesDto,
	ChatRoomWithMessagesDtoSchema,
} from "@convo/shared";
import { z } from "zod/v4";

/**
 * 根據用戶ID查詢該用戶所屬的所有聊天室的基本資訊。
 *
 * @param userId - 用戶的唯一識別碼 (UUID)。
 * @returns 包含所有找到的聊天室記錄陣列。
 */
export async function findChatRoomsByUserId(
	userId: string
): Promise<ChatRoomRecord[]> {
	const query = `
        SELECT * FROM chat_rooms as cr 
        JOIN room_members AS rm 
        ON cr.id = rm.room_id
        WHERE rm.user_id = $1
		ORDER BY cr.latest_message_at ASC
    `;
	const values = [userId];
	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRooms = result.rows;

	return z.array(ChatRoomRecordSchema).parse(chatRooms);
}

/**
 * 根據圖片URL查詢所有使用該圖片的聊天室。
 *
 * @param imgUrl - 聊天室頭貼的完整圖片URL。
 * @returns 包含所有找到的聊天室記錄陣列。
 */
export async function findChatRoomsByImgUrl(
	imgUrl: string
): Promise<ChatRoomRecord[]> {
	const query = `
        SELECT * FROM chat_rooms
        WHERE image_url = $1
        `;
	const values = [imgUrl];
	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRooms = result.rows;

	return z.array(ChatRoomRecordSchema).parse(chatRooms);
}

/**
 * 根據聊天室ID查詢單一聊天室的基本資訊。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @returns 找到的聊天室記錄。如果找不到，此函數可能會拋出Zod驗證錯誤 (如果ZodSchema.parse在undefined時失敗)。
 */
export async function findChatRoomByRoomId(
	roomId: string
): Promise<ChatRoomRecord | undefined> {
	const query = `
        SELECT * 
		FROM chat_rooms
        WHERE id = $1
        `;
	const values = [roomId];

	const result = await dbQuery<ChatRoomRecord>(query, values);
	const chatRoom = result.rows[0];
	return ChatRoomRecordSchema.optional().parse(chatRoom);
}

/**
 * 根據聊天室ID查詢聊天室及其所有成員的詳細資訊。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @returns 包含聊天室及成員資訊的DTO物件，如果找不到聊天室則返回`undefined`。
 */
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

	const result = await dbQuery<ChatRoomWithMembersDto>(query, values);
	const chatRoomWithMembers = result.rows[0];

	if (!chatRoomWithMembers) {
		return undefined;
	}

	return ChatRoomWithMembersDtoSchema.parse(chatRoomWithMembers);
}

/**
 * 根據聊天室ID查詢聊天室及其所有聊天訊息的詳細資訊。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @returns 包含聊天室及訊息資訊的DTO物件，如果找不到聊天室則返回`undefined`。
 */
export async function findChatRoomWithMessagesByRoomId(
	roomId: string
) /* : Promise<ChatRoomWithMessagesDto | undefined> */ {
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
                    'id', m.id,
                    'sender_id', m.sender_id,
					'room_id', cr.id,
                    'content', m.content,
                    'created_at', m.created_at,
                    'sender_username', u.username,
					'sender_avatar_url', u.avatar_url
                ) ORDER BY m.created_at ASC
            ) AS messages
        FROM
            chat_rooms cr
        LEFT JOIN
            messages m ON cr.id = m.room_id
        LEFT JOIN 
            users u ON m.sender_id = u.id
        WHERE
            cr.id = $1
        GROUP BY
            cr.id
        ;
    `;
	const values = [roomId];

	// 使用新的原始型別作為 dbQuery 的泛型參數
	const result = await dbQuery<ChatRoomWithMessagesDto>(query, values);
	const chatRoom = result.rows[0];

	if (!chatRoom) {
		return undefined;
	}

	// 過濾掉空訊息物件
	const processedMessages = chatRoom.messages.filter(
		(message) => message !== null && message.id !== null
	);

	const chatRoomWithMessages: ChatRoomWithMessagesDto = {
		...chatRoom,
		// 覆寫 messages 屬性
		messages: processedMessages,
	};

	// 使用 Zod 進行最終驗證
	return ChatRoomWithMessagesDtoSchema.parse(chatRoomWithMessages);
}

/**
 * 創建一個新的聊天室，並將指定成員加入。
 *
 * @param name - 聊天室的名稱。
 * @param creatorId - 創建者的用戶ID (UUID)。
 * @param members - 聊天室成員的用戶ID陣列，必須包含創建者。
 * @param [img] - 聊天室頭貼的URL (可選)。
 * @returns 創建成功的聊天室記錄。
 */
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

/**
 * 更新指定聊天室的名稱和圖片URL。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @param name - 聊天室的新名稱。
 * @param [imgUrl] - 聊天室的新頭貼URL (可選，設為`null`可移除現有頭貼)。
 * @returns 更新後的聊天室記錄。如果找不到聊天室，此函數可能會拋出Zod驗證錯誤 (如果ZodSchema.parse在undefined時失敗)。
 */
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

/**
 * 根據聊天室ID刪除聊天室。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @returns 被刪除的聊天室記錄。如果找不到聊天室，此函數可能會拋出Zod驗證錯誤 (如果ZodSchema.parse在undefined時失敗)。
 */
export async function deleteChatRoomByRoomId(
	roomId: string
): Promise<ChatRoomRecord> {
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
