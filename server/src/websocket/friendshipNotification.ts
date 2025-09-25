import {
	FriendRequestReceivedMessageType,
	FriendRequestAcceptedMessageType,
	FriendRequestRejectedMessageType,
} from "@convo/shared";
import { userConnections } from "./wss.js";

interface NotifyFriendRequestParams {
	recipientId: string;
	requester: {
		id: string;
		username: string;
		avatar_url: string | null;
	};
	requestId: string;
}

/**
 * 通知用戶收到好友邀請
 */
export function notifyFriendRequestReceived({
	recipientId,
	requester,
	requestId,
}: NotifyFriendRequestParams) {
	const recipientConnection = userConnections.get(recipientId);
	if (recipientConnection && recipientConnection.readyState === 1) {
		const message: FriendRequestReceivedMessageType = {
			event: "FRIEND_REQUEST_RECEIVED",
			payload: {
				requestId,
				requester,
			},
		};
		recipientConnection.send(JSON.stringify(message));
		console.info(
			`[WebSocket]已通知用戶 ${recipientId} 收到來自 ${requester.username} 的好友邀請`
		);
	} else {
		console.warn(`[WebSocket]無法通知用戶 ${recipientId}，連線不存在或已關閉`);
	}
}

interface NotifyFriendRequestResponseParams {
	senderId: string;
	responder: {
		id: string;
		username: string;
		avatar_url: string | null;
	};
}

/**
 * 通知用戶好友邀請被接受
 */
export function notifyFriendRequestAccepted({
	senderId,
	responder,
}: NotifyFriendRequestResponseParams) {
	const senderConnection = userConnections.get(senderId);
	if (senderConnection && senderConnection.readyState === 1) {
		const message: FriendRequestAcceptedMessageType = {
			event: "FRIEND_REQUEST_ACCEPTED",
			payload: {
				accepter: responder,
			},
		};
		senderConnection.send(JSON.stringify(message));
		console.info(
			`[WebSocket]已通知用戶 ${senderId} 好友邀請被 ${responder.username} 接受`
		);
	} else {
		console.warn(`[WebSocket]無法通知用戶 ${senderId}，連線不存在或已關閉`);
	}
}

/**
 * 通知用戶好友邀請被拒絕
 */
export function notifyFriendRequestRejected({
	senderId,
	responder,
}: NotifyFriendRequestResponseParams) {
	const senderConnection = userConnections.get(senderId);
	if (senderConnection && senderConnection.readyState === 1) {
		const message: FriendRequestRejectedMessageType = {
			event: "FRIEND_REQUEST_REJECTED",
			payload: {
				rejecter: responder,
			},
		};
		senderConnection.send(JSON.stringify(message));
		console.info(
			`[WebSocket]已通知用戶 ${senderId} 好友邀請被 ${responder.username} 拒絕`
		);
	} else {
		console.warn(`[WebSocket]無法通知用戶 ${senderId}，連線不存在或已關閉`);
	}
}
