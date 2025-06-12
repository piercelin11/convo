import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { ChatRoomRecordSchema } from "./db.schema";

/**
 * 創建聊天室 api 輸入值的 schema
 */
export const CreateGroupChatSchema = z.object({
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	members: z.array(z.string()),
	img: z.url().nullable(),
});

/**
 * 創建聊天室 api 輸入值的型別
 */
export type CreateGroupChatSchemaType = z.infer<typeof CreateGroupChatSchema>;

/**
 * 創建聊天室表單輸入值的 schema，主要用於 mutation payload 上
 */
export const CreateGroupChatFormSchema = CreateGroupChatSchema.omit({
	img: true,
}).extend({
	file: z.instanceof(File).nullable(),
});

/**
 * 創建聊天室表單輸入值的型別，主要用於 mutation payload 上
 */
export type CreateGroupChatFormSchemaType = z.infer<
	typeof CreateGroupChatFormSchema
>;

export const ChatRoomParamsSchema = z.object({
	roomId: z.uuid(),
});
export type ChatRoomParamsSchemaType = z.infer<typeof ChatRoomParamsSchema>;

export const ChatRoomsResponseSchema = ApiResponseSchema.extend({
	data: z.array(ChatRoomRecordSchema),
});
export type ChatRoomsResponseType = z.infer<typeof ChatRoomsResponseSchema>;

export const ChatRoomResponseSchema = ApiResponseSchema.extend({
	data: ChatRoomRecordSchema,
});
export type ChatRoomResponseType = z.infer<typeof ChatRoomResponseSchema>;
