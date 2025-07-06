import { dbQuery } from "@/utils/index.js";
import { MessageDto, MessageDtoSchema } from "@convo/shared";
import { z } from "zod/v4";

/**
 * 根據聊天室ID查詢該聊天室的所有聊天訊息。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @returns 包含所有找到的聊天訊息DTOs陣列。
 */
export async function findMessagesByRoomId(
	roomId: string
): Promise<MessageDto[]> {
	const query = `
        SELECT
            m.id AS id,
            u.username AS sender_username,
            u.avatar_url AS sender_avatar_url,
            m.created_at AS created_at,
            m.room_id AS room_id,
            m.content AS content,
            m.sender_id AS sender_id
        FROM
            messages m
        JOIN
            users u ON m.sender_id = u.id
        WHERE
            m.room_id = $1
        ORDER BY
            m.created_at DESC;
        `;
	const values = [roomId];

	const result = await dbQuery<MessageDto>(query, values);
	const messages = result.rows;
	return z.array(MessageDtoSchema).parse(messages);
}

/**
 * 創建一筆新的聊天訊息。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @param userId - 傳送訊息者的唯一識別碼 (UUID)。
 * @param content - 傳送的訊息內容。
 * @returns 聊天訊息的資料。
 */
export async function createMessages(
	roomId: string,
	userId: string,
	content: string
): Promise<MessageDto> {
	const query = `
        WITH inserted_message AS (
            INSERT INTO messages (room_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        ),
        updated_room AS (
            UPDATE chat_rooms
            SET
                latest_message_content = (SELECT content FROM inserted_message),
                latest_message_at = (SELECT created_at FROM inserted_message),
                latest_message_sender_id = (SELECT sender_id FROM inserted_message)
            WHERE
                id = (SELECT room_id FROM inserted_message)
        )
        SELECT
            im.id,
            im.room_id,
            im.sender_id,
            im.content,
            im.created_at,
            u.username AS sender_username, -- 從 users 表獲取
            u.avatar_url AS sender_avatar_url -- 從 users 表獲取
        FROM
            inserted_message im
        JOIN
            users u ON im.sender_id = u.id;
    `;
	const result = await dbQuery<MessageDto>(query, [roomId, userId, content]);

	const message = result.rows[0];

	return MessageDtoSchema.parse(message);
}
