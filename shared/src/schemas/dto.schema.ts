import { z } from "zod/v4";
import {
	ChatRoomRecordSchema,
	FriendshipStatusSchema,
	RoomMemberRecordSchema,
} from "./db.schema";

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

export const ChatRoomWithMembersDtoSchema = ChatRoomRecordSchema.extend({
	members: z.array(UserDTOSchema.extend({ joined_at: z.coerce.date() })),
});
export type ChatRoomWithMembersDto = z.infer<
	typeof ChatRoomWithMembersDtoSchema
>;
