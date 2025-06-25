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
            m.created_at ASC;
        `;
	const values = [roomId];

	const result = await dbQuery<MessageDto>(query, values);
	const messages = result.rows;
	return z.array(MessageDtoSchema).parse(messages);
}
