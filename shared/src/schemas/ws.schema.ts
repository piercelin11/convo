import { z } from "zod/v4";

export const JoinRoomPayloadSchema = z.object({
	roomId: z.uuid(),
});
export type JoinRoomPayloadSchemaType = z.infer<typeof JoinRoomPayloadSchema>

export const SendChatPayloadSchema = z.object({
	roomId: z.uuid(),
	text: z.string(),
});
export type SendChatPayloadSchemaType = z.infer<typeof SendChatPayloadSchema>

const JoinRoomMessageSchema = z.object({
	type: z.literal("join_room"),
	payload: JoinRoomPayloadSchema,
});

const SendChatMessageSchema = z.object({
	type: z.literal("send_chat"),
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
