const chatKeys = {
	/**
	 * 代表所有與 'chat' 相關的查詢的根源。
	 * 用途：用於全局性的失效或重置，例如登出時。
	 * 範例: invalidateQueries({ queryKey: chatKeys.all })
	 */
	all: ["chats"] as const,

	/**
	 * 代表所有「列表類型」的聊天室查詢。
	 * 用途：當一個聊天室被建立或刪除時，可以讓所有列表都失效。
	 * 範例: invalidateQueries({ queryKey: chatKeys.lists() })
	 */
	lists: () => [...chatKeys.all, "list"] as const,

	/**
	 * 代表所有「詳情類型」的單一聊天室查詢。
	 * 用途：可以對所有詳情頁的快取進行批量操作。
	 */
	details: () => [...chatKeys.all, "detail"] as const,

	/**
	 * 代表「單個聊天室」的查詢。
	 * 這是您需要的獲取單個聊天室的 key。
	 * @param roomId 聊天室的 ID
	 */
	detail: (roomId: string) => [...chatKeys.details(), roomId] as const,

	/**
	 * 代表「帶有特定搜尋詞」的聊天室列表查詢。
	 * @param searchTerm 搜尋詞
	 */
	search: (searchTerm: string) => [...chatKeys.lists(), searchTerm] as const,
};

export default chatKeys;
