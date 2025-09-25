import friendshipKeys from "@/queries/friendship/friendshipKeys";
import type {
	FriendRequestReceivedMessageType,
	FriendRequestAcceptedMessageType,
	FriendRequestRejectedMessageType,
} from "@convo/shared";
import type { QueryClient } from "@tanstack/react-query";

/**
 * 處理收到好友邀請通知
 * 更新好友邀請列表快取並觸發通知
 * @param queryClient - TanStack Query 客戶端實例，用於管理快取
 * @param payload - 好友邀請通知負載
 */
export function handleFriendRequestReceived(
	queryClient: QueryClient,
	payload: FriendRequestReceivedMessageType["payload"]
) {
	console.info(
		`[WebSocket]收到來自 ${payload.requester.username} 的好友邀請`,
		payload
	);

	// 使緩存失效以重新獲取好友邀請列表
	queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });

	// 也可以使搜尋結果失效，確保友誼狀態更新
	queryClient.invalidateQueries({ queryKey: ["user", "search"] });
}

/**
 * 處理好友邀請被接受通知
 * 更新好友列表快取
 * @param queryClient - TanStack Query 客戶端實例，用於管理快取
 * @param payload - 好友邀請通知負載
 */
export function handleFriendRequestAccepted(
	queryClient: QueryClient,
	payload: FriendRequestAcceptedMessageType["payload"]
) {
	console.info(
		`[WebSocket]好友邀請被 ${payload.accepter.username} 接受`,
		payload
	);

	// 使緩存失效以重新獲取好友列表和邀請列表
	queryClient.invalidateQueries({ queryKey: friendshipKeys.friends() });
	queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });

	// 使搜尋結果失效，確保友誼狀態更新
	queryClient.invalidateQueries({ queryKey: ["user", "search"] });

	// TODO: 可以添加成功通知 toast
}

/**
 * 處理好友邀請被拒絕通知
 * 更新相關快取
 * @param queryClient - TanStack Query 客戶端實例，用於管理快取
 * @param payload - 好友邀請通知負載
 */
export function handleFriendRequestRejected(
	queryClient: QueryClient,
	payload: FriendRequestRejectedMessageType["payload"]
) {
	console.info(
		`[WebSocket]好友邀請被 ${payload.rejecter.username} 拒絕`,
		payload
	);

	// 使緩存失效以重新獲取邀請列表
	queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });

	// 使搜尋結果失效，確保友誼狀態更新
	queryClient.invalidateQueries({ queryKey: ["user", "search"] });

	// TODO: 可以添加通知
}
