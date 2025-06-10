import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { ChatRoomRecordSchema } from "./db.schema";

export const CreateGroupChatSchema = z.object({
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	members: z.array(z.string()),
});

export type CreateGroupChatSchemaType = z.infer<typeof CreateGroupChatSchema>;

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
