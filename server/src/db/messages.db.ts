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
            m.id,
            m.room_id,
            m.sender_id,
            m.content,
            m.created_at,
            u.username AS sender_username,
            u.avatar_url AS sender_avatar_url,

            -- --- 這是新增的計算邏輯 ---
            -- 為每一則訊息 (m)，計算有多少成員的 last_read_at 晚於或等於此訊息的建立時間
            (
                SELECT COUNT(*)
                FROM room_members rm
                WHERE
                    -- 條件1：必須是同一個房間的成員
                    rm.room_id = m.room_id
                    -- 條件2：不能計算發送者自己 (自己發的訊息對自己來說永遠是已讀)
                    AND rm.user_id != m.sender_id
                    -- 條件3：該成員的最後已讀時間戳，必須晚於或等於此訊息的建立時間
                    AND rm.last_read_at >= m.created_at
            )::integer AS read_by_count

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
            u.username AS sender_username,
            u.avatar_url AS sender_avatar_url,

            -- --- 新增的計算邏輯，與 findMessagesByRoomId 中的邏輯相同 ---
            (
                SELECT COUNT(*)
                FROM room_members rm
                WHERE
                    -- 條件1：是同一個房間的成員
                    rm.room_id = im.room_id
                    -- 條件2：不是發送者本人
                    AND rm.user_id != im.sender_id
                    -- 條件3：該成員的最後已讀時間戳，晚於或等於此訊息的建立時間
                    AND rm.last_read_at >= im.created_at
            )::integer AS read_by_count -- 將 COUNT(*) 的結果轉換為 integer

        FROM
            inserted_message im
        JOIN
            users u ON im.sender_id = u.id;
    `;
	const result = await dbQuery<MessageDto>(query, [roomId, userId, content]);

	const message = result.rows[0];

	return MessageDtoSchema.parse(message);
}
