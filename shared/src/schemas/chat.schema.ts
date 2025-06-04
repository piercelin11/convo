import { z } from "zod/v4";

export const createGroupChatSchema = z.object({
	name: z.string().min(1, { message: "群組名稱至少要有一個字" }),
	members: z.array(z.string()),
});

export type CreateGroupChatSchemaType = z.infer<typeof createGroupChatSchema>;
