import z from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { FriendshipDtoSchema, FriendshipDto } from "./dto.schema";

/**
 * 取得好友相關的 API 回應資料結構。
 * API 回應中包含好友紀錄的資料結構 {@link FriendshipDtoSchema}。
 */
export const FriendshipResponseSchema = ApiResponseSchema.extend({
	data: z.array(FriendshipDtoSchema),
});

/**
 * 取得好友相關的 API 回應資料型別。
 * API 回應中包含好友紀錄的資料型別 {@link FriendshipDto}。
 */
export type FriendshipResponseType = z.infer<typeof FriendshipResponseSchema>;
