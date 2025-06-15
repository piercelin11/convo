import * as friendshipsDb from "@/db/friendship.db.js";
import { AuthorizationError } from "@/utils/error.utils.js";
import { Request, Response, NextFunction } from "express";

/**
 * 處理獲取使用者好友列表的請求。
 * 驗證使用者身份後，從資料庫中獲取該使用者所有狀態為「接受」的好友資訊。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 中介軟體附加的 `req.user`。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含使用者好友列表的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權。
 */
export async function getFriendshipsHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = req.user;
		if (!user) throw new AuthorizationError();

		const friendships = await friendshipsDb.findFriendshipsByUserId(user.id);

		res.status(200).json({
			success: true,
			message: "成功獲取使用者的好友",
			data: friendships,
		});
	} catch (error) {
		next(error); // 將錯誤傳遞給全局錯誤處理中介軟體
	}
}
