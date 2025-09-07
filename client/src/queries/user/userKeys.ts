const userkeys = {
	// 代表所有與 'users' 相關的查詢的根源。
	all: ["users"] as const,

	//  代表所有「個資更新」的使用者查詢。
	profile: () => [...userkeys.all, "profile"] as const,

	// 專門用於「搜尋」的查詢。
	// 接受一個搜尋字串 query，讓不同搜尋關鍵字有各自的快取。
	search: (query: string) => [...userkeys.all, "search", query] as const,
};

export default userkeys;
