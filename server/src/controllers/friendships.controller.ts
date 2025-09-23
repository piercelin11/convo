import { AuthorizationError } from "@/utils/error.utils.js";
import { RequesterSchemaType, TargetUserSchemaType } from "@convo/shared";
import { Request, Response, NextFunction } from "express";
import * as friendshipService from "@/services/friendship.service.js";
import * as FriendshipDb from "@/db/friendship.db.js";

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

		const friendships = await FriendshipDb.findFriendshipsByUserId(user.id);

		res.status(200).json({
			success: true,
			message: "成功獲取使用者的好友",
			data: friendships,
		});
	} catch (error) {
		next(error); // 將錯誤傳遞給全局錯誤處理中介軟體
	}
}

/**
 * 發送好友邀請
 */

export async function sentRequestHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (邀請者)
		const requesterId = req.user?.id;
		if (!requesterId) throw new AuthorizationError();

		// 2.取得被邀請的人ID
		const { targetUserId } = req.body as TargetUserSchemaType;
		if (!targetUserId) throw new AuthorizationError();

		// 3.呼叫service
		const newFriendship = await friendshipService.createFriendshipRequest({
			requesterId,
			targetUserId,
		});

		// 4.回傳成功

		res.status(200).json({
			success: true,
			message: "成功寄送邀請",
			data: newFriendship,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 接受好友邀請
 */

export async function acceptRequestHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (接受者)
		const addresseeId = req.user?.id;
		if (!addresseeId) throw new AuthorizationError();

		// 2.取得邀請者的 ID
		const { requesterId } = req.body as RequesterSchemaType;
		if (!requesterId) throw new AuthorizationError();

		console.log(requesterId);

		// 3.呼叫service
		const updatedFriendship = await friendshipService.acceptFriendshipRequest({
			requesterId,
			addresseeId,
		});

		// 4.回傳成功
		res.status(200).json({
			success: true,
			message: "已接受交友邀請",
			data: updatedFriendship,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 取消好友邀請
 */

export async function cancelRequestHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (邀請者)
		const requesterId = req.user?.id;
		if (!requesterId) throw new AuthorizationError();

		// 2.取得被邀請的人ID
		const { targetUserId } = req.body as TargetUserSchemaType;

		// 3.呼叫service
		await friendshipService.cancelFriendshipRequest({
			requesterId,
			targetUserId,
		});

		// 4.回傳成功
		res.status(200).json({
			success: true,
			message: "已取消交友邀請",
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 封鎖好友
 */

export async function blockUserHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (使用者)
		const requesterId = req.user?.id;
		if (!requesterId) throw new AuthorizationError();

		// 2.取得想封鎖的對象的ID
		const { targetUserId } = req.body as TargetUserSchemaType;

		// 3.執行service
		const blockedRelationship = await friendshipService.blockUser({
			requesterId,
			targetUserId,
		});

		// 4.回傳成功
		res.status(200).json({
			success: true,
			message: "已封鎖使用者",
			data: blockedRelationship,
		});
	} catch (error) {
		next(error);
	}
}
/**
 * 獲得所有好友邀請
 */

export async function getRequestHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (使用者)
		const requesterId = req.user?.id;
		if (!requesterId) throw new AuthorizationError();

		// 2.執行service
		const pendingRequests =
			await FriendshipDb.findPendingRequestsForUser(requesterId);
		// 3.回傳成功
		res.status(200).json({
			success: true,
			message: "已獲取所有好友邀請",
			data: pendingRequests,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 搜尋所有好友邀請
 */
export async function searchRequestHandlers(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (使用者)
		const userId = req.user?.id;
		if (!userId) throw new AuthorizationError();
		// 2.取得搜尋關鍵字
		const { q } = req.query as { q: string };
		// 3.執行service
		const pendingRequests = await FriendshipDb.searchPendingRequests({
			userId,
			query: q,
		});

		// 4.回傳成功
		res.status(200).json({
			success: true,
			message: "已搜尋好友邀請",
			data: pendingRequests,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 解除好友關係
 */

export async function unfriendHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// 1. 取得你自己的 ID (使用者)
		const userId = req.user?.id;
		if (!userId) throw new AuthorizationError();
		// 2.取得想解除對象的ID
		const { targetUserId } = req.body as TargetUserSchemaType;

		// 3.呼叫service
		await friendshipService.deleteFriend({
			requesterId: userId,
			targetUserId,
		});

		// 4. 回傳 204 No Content 響應
		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
