import { z } from "zod/v4";
import { ChatRoomRecordSchema, FriendshipStatusSchema } from "./db.schema";

/**
 * 用於對外傳輸的使用者資料物件 (Data Transfer Object)
 * 通常會隱藏 password_hash 等敏感欄位
 */
export const UserDTOSchema = z.object({
	id: z.uuid({ message: "使用者 ID 必須是有效的 UUID" }),
	username: z.string().min(1).max(50),
	email: z.email(),
	age: z.number().int().positive().nullable(),
	avatar_url: z.url("頭像必須是有效的 URL 格式").nullable(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

/**
 * 用於顯示好友列表的資料傳輸物件
 * 包含了使用者基本資訊和好友關係狀態
 */
export const FriendshipDtoSchema = z.object({
	// 這裡的 id 通常是指對方的 user id
	id: z.uuid(),
	username: z.string(),
	email: z.email(),
	avatar_url: z.url().nullable(),
	friendship_status: FriendshipStatusSchema,
});
export type FriendshipDto = z.infer<typeof FriendshipDtoSchema>;

/**
 * 用於聊天訊息的資料傳輸物件
 */
export const MessageDtoSchema = z.object({
	id: z.uuid(),
	sender_username: z.string(),
	sender_avatar_url: z.url().nullable(),
	created_at: z.coerce.date(),
	room_id: z.string(),
	content: z.string(),
	sender_id: z.string(),
	read_by_count: z.number().int().nonnegative(),
});
export type MessageDto = z.infer<typeof MessageDtoSchema>;

/**
 * 包含聊天室基本資訊及尚未讀取訊息數量的資料結構。
 */
export const ChatRoomDtoSchema = ChatRoomRecordSchema.extend({
	last_read_at: z.coerce.date().nullable(),
	unread_count: z.number(),
});
export type ChatRoomDto = z.infer<typeof ChatRoomDtoSchema>;

/**
 * 包含聊天室基本資訊及詳細成員列表的資料傳輸物件結構。
 * 成員資訊會擴充包含加入時間。
 */
export const ChatRoomWithMembersDtoSchema = ChatRoomRecordSchema.omit({
	latest_message_content: true,
	latest_message_at: true,
	latest_message_sender_id: true,
}).extend({
	members: z.array(UserDTOSchema.extend({ joined_at: z.coerce.date() })),
});
export type ChatRoomWithMembersDto = z.infer<
	typeof ChatRoomWithMembersDtoSchema
>;
