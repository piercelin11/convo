import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import friendshipKeys from "./friendshipKeys";
import { friendshipService } from "@/api";

// 獲取用戶好友列表
export function useFriendshipQuery() {
	return useQuery({
		queryKey: friendshipKeys.friends(),
		queryFn: friendshipService.getUserFriends,
	});
}

// 獲取好友邀請列表
export function useFriendRequestsQuery() {
	return useQuery({
		queryKey: friendshipKeys.requests(),
		queryFn: friendshipService.getFriendRequests,
	});
}

// 發送好友邀請
export function useSendFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: friendshipService.sendFriendRequest,
		onSuccess: () => {
			// 重新獲取好友列表和邀請列表
			queryClient.invalidateQueries({ queryKey: friendshipKeys.friends() });
			queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });
			// 可能也需要重新獲取搜尋結果（更新友誼狀態）
			queryClient.invalidateQueries({ queryKey: ["user", "search"] });
		},
	});
}

// 接受好友邀請
export function useAcceptFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: friendshipService.acceptFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: friendshipKeys.friends() });
			queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });
			queryClient.invalidateQueries({ queryKey: ["user", "search"] });
		},
	});
}

// 取消好友邀請（發送者取消自己發出的邀請）
export function useCancelFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: friendshipService.cancelFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: friendshipKeys.friends() });
			queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });
			queryClient.invalidateQueries({ queryKey: ["user", "search"] });
		},
	});
}

// 拒絕好友邀請（接收者拒絕收到的邀請）
export function useRejectFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: friendshipService.rejectFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: friendshipKeys.friends() });
			queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });
			queryClient.invalidateQueries({ queryKey: ["user", "search"] });
		},
	});
}

// 封鎖用戶
export function useBlockUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: friendshipService.blockUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: friendshipKeys.friends() });
			queryClient.invalidateQueries({ queryKey: friendshipKeys.requests() });
			queryClient.invalidateQueries({ queryKey: ["user", "search"] });
		},
	});
}
