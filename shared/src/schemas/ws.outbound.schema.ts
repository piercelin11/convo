import z from "zod/v4";
import { MessageDtoSchema } from "./dto.schema";

/**
 * 收到新訊息的訊息結構
 * 由伺服器端傳向客戶端
 */
export const NewChatMessageSchema = z.object({
	event: z.literal("NEW_CHAT"),
	payload: MessageDtoSchema,
});
/**
 * 收到新訊息的訊息型別
 * 由伺服器端傳向客戶端
 */
export type NewChatMessageSchemaType = z.infer<typeof NewChatMessageSchema>;

/**
 * 被加進聊天室的訊息結構
 * 由伺服器端傳向客戶端
 */
export const NewRoomMessageSchema = z.object({
	event: z.literal("ROOM_CHANGE"),
});
/**
 * 被加進聊天室的訊息型別
 * 由伺服器端傳向客戶端
 */
export type NewRoomMessageSchemaType = z.infer<typeof NewRoomMessageSchema>;

/**
 * 新成員加入聊天室已讀訊息的訊息結構
 * 由伺服器端傳向客戶端
 */
export const ReadRoomMessageSchema = z.object({
	event: z.literal("READ_ROOM"),
	payload: z.object({
		roomId: z.uuid(),
	}),
});
/**
 * 新成員加入聊天室已讀訊息的訊息型別
 * 由伺服器端傳向客戶端
 */
export type ReadRoomSchemaType = z.infer<typeof ReadRoomMessageSchema>;

/**
 * 發生錯誤的訊息結構
 * 由伺服器端傳向客戶端
 */
export const ErrorMessageSchema = z.object({
	event: z.literal("ERROR"),
	payload: z.object({
		message: z.string().min(1, { message: "錯誤訊息至少要有1個字" }),
	}),
});
/**
 * 發生錯誤的訊息型別
 * 由伺服器端傳向客戶端
 */
export type ErrorMessageSchemaType = z.infer<typeof ErrorMessageSchema>;

/**
 * 伺服器端傳向客戶端的 WebSocket 訊息結構。
 * 透過 `event` 來判斷訊息結構，目前包含 {@link NewChatMessageSchema}。
 */
export const OutboundMessageSchema = z.discriminatedUnion(
	"event",
	[NewChatMessageSchema, ErrorMessageSchema, NewRoomMessageSchema, ReadRoomMessageSchema],
	{ message: "伺服器端傳到客戶端的 WebSocket 訊息結構錯誤" }
);
/**
 * 伺服器端傳向客戶端的 WebSocket 訊息型別。
 * 透過 `event` 來判斷訊息型別。
 */
export type OutboundMessageSchemaType = z.infer<typeof OutboundMessageSchema>;