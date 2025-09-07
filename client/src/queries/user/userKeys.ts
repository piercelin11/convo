const userkeys = {
	// 代表所有與 'users' 相關的查詢的根源。
	all: ["users"] as const,

	//  代表所有「個資更新」的使用者查詢。
	profile: () => [...userkeys.all, "profile"] as const,
};

export default userkeys;
