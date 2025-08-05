import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { ChatRoomRecordSchema } from "./db.schema";
import { ChatRoomDtoSchema } from "./dto.schema";

/**
 * 建立聊天室所需的資料結構。
 */
export const CreateChatRoomSchema = z.object({
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	members: z.array(z.string()),
	img: z.url().nullable(),
});

/**
 * 建立聊天室所需的資料型別。
 */
export type CreateChatRoomSchemaType = z.infer<typeof CreateChatRoomSchema>;

/**
 * 編輯聊天室所需的資料結構。
 */
export const EditChatRoomSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	img: z.url().nullable(),
});

/**
 * 編輯聊天室所需的資料型別。
 */
export type EditChatRoomSchemaType = z.infer<typeof EditChatRoomSchema>;

/**
 * 已讀聊天室所需的資料結構。
 */
export const ReadChatRoomSchema = z.object({
	id: z.uuid(),
});

/**
 * 已讀聊天室所需的資料型別。
 */
export type ReadChatRoomSchemaType = z.infer<typeof ReadChatRoomSchema>;


/**
 * 定義用於 URL 參數的聊天室相關資料結構。
 * 主要用於從路由中獲取聊天室 ID。
 */
export const ChatRoomParamsSchema = z.object({
	roomId: z.uuid(),
});

/**
 * 定義用於 URL 參數的聊天室相關資料型別。
 * 主要用於從路由中獲取聊天室 ID。
 */
export type ChatRoomParamsSchemaType = z.infer<typeof ChatRoomParamsSchema>;

/**
 * 取得聊天室列表相關的 API 回應資料結構。
 * API 回應中包含多個聊天室記錄的資料結構 {@link ChatRoomDtoSchema}。
 */
export const ChatRoomsResponseSchema = ApiResponseSchema.extend({
	data: z.array(ChatRoomDtoSchema),
});

/**
 * 取得聊天室列表相關的 API 回應資料型別。
 * API 回應中包含多個聊天室記錄的資料型別 {@link ChatRoomDtoSchema}。
 */
export type ChatRoomsResponseType = z.infer<typeof ChatRoomsResponseSchema>;

/**
 * 取得聊天室列表相關的 API 回應資料結構。
 * API 回應中包含單個聊天室記錄的資料結構 {@link ChatRoomRecordSchema}。
 */
export const ChatRoomResponseSchema = ApiResponseSchema.extend({
	data: ChatRoomRecordSchema,
});

/**
 * 取得聊天室列表相關的 API 回應資料型別。
 * API 回應中包含單個聊天室記錄的資料型別 {@link ChatRoomRecordSchema}。
 */
export type ChatRoomResponseType = z.infer<typeof ChatRoomResponseSchema>;
