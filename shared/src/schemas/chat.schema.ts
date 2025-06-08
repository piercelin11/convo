import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { ChatRoomRecordSchema } from "./db.schema";

export const CreateGroupChatSchema = z.object({
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	members: z.array(z.string()),
});

export type CreateGroupChatSchemaType = z.infer<typeof CreateGroupChatSchema>;

export const ChatResponseSchema = ApiResponseSchema.extend({
	chatRooms: z.array(ChatRoomRecordSchema),
});

export type ChatResponseType = z.infer<typeof ChatResponseSchema>;
