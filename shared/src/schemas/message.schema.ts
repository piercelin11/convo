import z from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { MessageDtoSchema, MessageDto } from "./dto.schema";

/**
 * 取得聊天訊息相關的 API 回應資料結構。
 * API 回應中包含聊天訊息紀錄的資料結構 {@link MessageDtoSchema}。
 */
export const MessageResponseSchema = ApiResponseSchema.extend({
    data: z.array(MessageDtoSchema),
});

/**
 * 取得聊天訊息相關的 API 回應資料型別。
 * API 回應中包含聊天訊息紀錄的資料型別 {@link MessageDto}。
 */
export type MessageResponseType = z.infer<typeof MessageResponseSchema>;
