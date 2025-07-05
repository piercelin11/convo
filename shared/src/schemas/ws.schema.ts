import { z } from "zod/v4";
import { MessageRecordSchema } from "./db.schema";
import { MessageDtoSchema } from "./dto.schema";

//以下為客戶端傳向伺服器端的訊息結構

/**
 * 加入聊天室的負載（payload）資料結構
 * 由客戶端傳向伺服器端
 */
export const JoinRoomPayloadSchema = z.object({
	roomId: z.uuid(),
});
/**
 * 加入聊天室的負載（payload）資料型別
 * 由客戶端傳向伺服器端
 */
export type JoinRoomPayloadSchemaType = z.infer<typeof JoinRoomPayloadSchema>;

/**
 * 傳送聊天室訊息的負載（payload）資料結構
 * 由客戶端傳向伺服器端
 */
export const SendChatPayloadSchema = z.object({
	roomId: z.uuid(),
	userId: z.uuid(),
	text: z.string(),
});
/**
 * 傳送聊天室訊息的負載（payload）資料型別
 * 由客戶端傳向伺服器端
 */
export type SendChatPayloadSchemaType = z.infer<typeof SendChatPayloadSchema>;

const JoinRoomMessageSchema = z.object({
	type: z.literal("JOIN_ROOM"),
	payload: JoinRoomPayloadSchema,
});

const SendChatMessageSchema = z.object({
	type: z.literal("SEND_CHAT"),
	payload: SendChatPayloadSchema,
});

/**
 * 客戶端傳向伺服器端的 WebSocket 訊息結構。
 * 透過 `type` 來判斷訊息結構，目前包含 {@link SendChatMessageSchema} 與 {@link JoinRoomMessageSchema} 兩個結構。
 */
export const InboundMessageSchema = z.discriminatedUnion(
	"type",
	[JoinRoomMessageSchema, SendChatMessageSchema],
	{ message: "客戶端傳入伺服器端的 WebSocket 訊息結構錯誤" }
);
/**
 * 客戶端傳向伺服器端的 WebSocket 訊息型別。
 * 透過 `type` 來判斷訊息型別。
 */
export type InboundMessageSchemaType = z.infer<typeof InboundMessageSchema>;

//以下為伺服器端傳向客戶端的訊息結構

/**
 * 收到新訊息的資料結構
 * 由伺服器端傳向客戶端
 */
export const NewChatMessageSchema = z.object({
	event: z.literal("NEW_CHAT"),
	payload: MessageDtoSchema,
});
/**
 * 收到新訊息的資料型別
 * 由伺服器端傳向客戶端
 */
export type NewChatMessageSchemaType = z.infer<typeof NewChatMessageSchema>;

/**
 * 發生錯誤的資料結構
 * 由伺服器端傳向客戶端
 */
export const ErrorMessageSchema = z.object({
	event: z.literal("ERROR"),
	payload: z.object({
		message: z.string().min(1, { message: "錯誤訊息至少要有1個字" }),
	}),
});
/**
 * 發生錯誤的資料型別
 * 由伺服器端傳向客戶端
 */
export type ErrorMessageSchemaType = z.infer<typeof ErrorMessageSchema>;

/**
 * 伺服器端傳向客戶端的 WebSocket 訊息結構。
 * 透過 `event` 來判斷訊息結構，目前包含 {@link NewChatMessageSchema}。
 */
export const OutboundMessageSchema = z.discriminatedUnion(
	"event",
	[NewChatMessageSchema, ErrorMessageSchema],
	{ message: "伺服器端傳到客戶端的 WebSocket 訊息結構錯誤" }
);
/**
 * 伺服器端傳向客戶端的 WebSocket 訊息型別。
 * 透過 `event` 來判斷訊息型別。
 */
export type OutboundMessageSchemaType = z.infer<typeof OutboundMessageSchema>;
