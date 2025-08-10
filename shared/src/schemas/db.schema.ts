import { z } from "zod/v4";

/**
 * 使用者表格在資料庫的原始記錄型別
 */
export const UserRecordSchema = z.object({
	id: z.uuid({ message: "使用者 ID 必須是有效的 UUID" }),
	username: z
		.string()
		.min(1, "使用者名稱不可為空")
		.max(50, "使用者名稱長度不可超過 50"),
	email: z.email("無效的 Email 格式").max(255),
	password_hash: z.string().min(1, "密碼雜湊不可為空").max(255),
	age: z.number().int("年齡必須是整數").positive("年齡必須是正數").nullable(),
	avatar_url: z.url("無效的 URL 格式").nullable(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});
export type UserRecord = z.infer<typeof UserRecordSchema>;

/**
 * 使用者偏好設定表格在資料庫的原始記錄型別
 */
export const UserPreferenceRecordSchema = z.object({
	user_id: z.uuid(),
	theme: z.string().max(20).default("light"),
	notifications_enabled: z.boolean().default(true),
	updated_at: z.coerce.date(),
});
export type UserPreferenceRecord = z.infer<typeof UserPreferenceRecordSchema>;

// 定義 ChatRoomType 的 Zod Enum
export const ChatRoomTypeSchema = z.enum(["direct", "group"]);
export type ChatRoomType = z.infer<typeof ChatRoomTypeSchema>;

/**
 * 聊天室表格在資料庫的原始記錄型別
 */
export const ChatRoomRecordSchema = z.object({
	id: z.uuid(),
	name: z.string().max(100).nullable(),
	type: ChatRoomTypeSchema,
	creator_id: z.uuid().nullable(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	image_url: z.url().nullable(),
	latest_message_content: z.string().nullable(),
    latest_message_at: z.coerce.date().nullable(),
    latest_message_sender_id: z.uuid().nullable(),
});
export type ChatRoomRecord = z.infer<typeof ChatRoomRecordSchema>;

// 定義 FriendshipStatus 的 Zod Enum
export const FriendshipStatusSchema = z.enum([
	"pending",
	"accepted",
	"blocked",
]);
export type FriendshipStatus = z.infer<typeof FriendshipStatusSchema>;

/**
 * 好友關係表格在資料庫的原始記錄型別
 */
export const FriendshipRecordSchema = z.object({
	requester_id: z.uuid(),
	addressee_id: z.uuid(),
	status: FriendshipStatusSchema.default("pending"),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});
export type FriendshipRecord = z.infer<typeof FriendshipRecordSchema>;

/**
 * 聊天室成員表格在資料庫的原始記錄型別
 */
export const RoomMemberRecordSchema = z.object({
	room_id: z.uuid(),
	user_id: z.uuid(),
	joined_at: z.coerce.date(),
	// 如果未來加入 last_read_at，可以這樣寫：
	// last_read_at: z.coerce.date().nullable().optional(),
});
export type RoomMemberRecord = z.infer<typeof RoomMemberRecordSchema>;

/**
 * 訊息表格在資料庫的原始記錄型別
 */
export const MessageRecordSchema = z.object({
	// 假設主鍵為 UUID，若為數字則改為 z.number().int().positive()
	id: z.uuid(),
	room_id: z.uuid(),
	sender_id: z.uuid(),
	content: z.string().min(1, "訊息內容不可為空"),
	created_at: z.coerce.date(),
});
export type MessageRecord = z.infer<typeof MessageRecordSchema>;
