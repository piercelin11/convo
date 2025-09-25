const friendshipKeys = {
	all: ["friendship"] as const,
	lists: () => [...friendshipKeys.all, "list"] as const,
	list: (filters: string) => [...friendshipKeys.lists(), { filters }] as const,
	details: () => [...friendshipKeys.all, "detail"] as const,
	detail: (id: string) => [...friendshipKeys.details(), id] as const,
	// 用戶好友列表
	friends: () => [...friendshipKeys.lists(), "friends"] as const,
	// 好友邀請列表
	requests: () => [...friendshipKeys.lists(), "requests"] as const,
	// 特定用戶的友誼狀態
	status: (userId: string) =>
		[...friendshipKeys.details(), "status", userId] as const,
};

export default friendshipKeys;
