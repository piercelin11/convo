import { z } from "zod/v4";

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
 * 離開聊天室的負載（payload）資料結構
 * 由客戶端傳向伺服器端
 */
export const LeaveRoomPayloadSchema = z.object({
	roomId: z.uuid(),
});
/**
 * 離開聊天室的負載（payload）資料型別
 * 由客戶端傳向伺服器端
 */
export type LeaveRoomPayloadSchemaType = z.infer<typeof LeaveRoomPayloadSchema>;

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

const LeaveRoomMessageSchema = z.object({
	type: z.literal("LEAVE_ROOM"),
	payload: LeaveRoomPayloadSchema,
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
	[JoinRoomMessageSchema, SendChatMessageSchema, LeaveRoomMessageSchema],
	{ message: "客戶端傳入伺服器端的 WebSocket 訊息結構錯誤" }
);
/**
 * 客戶端傳向伺服器端的 WebSocket 訊息型別。
 * 透過 `type` 來判斷訊息型別。
 */
export type InboundMessageSchemaType = z.infer<typeof InboundMessageSchema>;


