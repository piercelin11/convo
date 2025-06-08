import z from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { FriendshipDtoSchema } from "./dto.schema";

export const FriendshipResponseSchema = ApiResponseSchema.extend({
	friendships: z.array(FriendshipDtoSchema),
});

export type FriendshipResponseType = z.infer<typeof FriendshipResponseSchema>;
