import z from "zod/v4";
import { MessageDtoSchema } from "./dto.schema";

// 友誼通知相關的基礎 Schema
const FriendshipNotificationUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	avatar_url: z.string().nullable(),
});

/**
 * 收到好友邀請的通知負載
 */
export const FriendRequestReceivedPayloadSchema = z.object({
	requestId: z.string(),
	requester: FriendshipNotificationUserSchema,
});

/**
 * 好友邀請被接受的通知負載
 */
export const FriendRequestAcceptedPayloadSchema = z.object({
	accepter: FriendshipNotificationUserSchema,
});

/**
 * 好友邀請被拒絕的通知負載
 */
export const FriendRequestRejectedPayloadSchema = z.object({
	rejecter: FriendshipNotificationUserSchema,
});

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
 * 收到好友邀請的通知消息結構
 * 由伺服器端傳向客戶端
 */
export const FriendRequestReceivedMessageSchema = z.object({
	event: z.literal("FRIEND_REQUEST_RECEIVED"),
	payload: FriendRequestReceivedPayloadSchema,
});

/**
 * 好友邀請被接受的通知消息結構
 * 由伺服器端傳向客戶端
 */
export const FriendRequestAcceptedMessageSchema = z.object({
	event: z.literal("FRIEND_REQUEST_ACCEPTED"),
	payload: FriendRequestAcceptedPayloadSchema,
});

/**
 * 好友邀請被拒絕的通知消息結構
 * 由伺服器端傳向客戶端
 */
export const FriendRequestRejectedMessageSchema = z.object({
	event: z.literal("FRIEND_REQUEST_REJECTED"),
	payload: FriendRequestRejectedPayloadSchema,
});

// 類型定義
export type FriendRequestReceivedMessageType = z.infer<typeof FriendRequestReceivedMessageSchema>;
export type FriendRequestAcceptedMessageType = z.infer<typeof FriendRequestAcceptedMessageSchema>;
export type FriendRequestRejectedMessageType = z.infer<typeof FriendRequestRejectedMessageSchema>;

/**
 * 伺服器端傳向客戶端的 WebSocket 訊息結構。
 * 透過 `event` 來判斷訊息結構，包含聊天訊息、好友通知等。
 */
export const OutboundMessageSchema = z.discriminatedUnion(
	"event",
	[
		NewChatMessageSchema,
		ErrorMessageSchema,
		NewRoomMessageSchema,
		ReadRoomMessageSchema,
		FriendRequestReceivedMessageSchema,
		FriendRequestAcceptedMessageSchema,
		FriendRequestRejectedMessageSchema,
	],
	{ message: "伺服器端傳到客戶端的 WebSocket 訊息結構錯誤" }
);
/**
 * 伺服器端傳向客戶端的 WebSocket 訊息型別。
 * 透過 `event` 來判斷訊息型別。
 */
export type OutboundMessageSchemaType = z.infer<typeof OutboundMessageSchema>;