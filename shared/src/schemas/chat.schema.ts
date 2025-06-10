import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { ChatRoomRecordSchema } from "./db.schema";

export const CreateGroupChatSchema = z.object({
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	members: z.array(z.string()),
});

export type CreateGroupChatSchemaType = z.infer<typeof CreateGroupChatSchema>;

export const ChatRoomsResponseSchema = ApiResponseSchema.extend({
	data: z.array(ChatRoomRecordSchema),
});

export const ChatRoomResponseSchema = ApiResponseSchema.extend({
	data: ChatRoomRecordSchema,
});

export type ChatRoomsResponseType = z.infer<typeof ChatRoomsResponseSchema>;

export type ChatRoomResponseType = z.infer<typeof ChatRoomResponseSchema>;
