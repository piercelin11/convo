import * as messagesDB from "@/db/messages.db.js";
import { NotFoundError } from "@/utils/index.js";

import { Request, Response, NextFunction } from "express"; // 導入 NextFunction

/**
 * 處理獲取指定聊天室資訊的請求。
 * 根據路由參數中的 `roomId` 查詢單一聊天室的詳細資訊。
 *
 * @param req - Express 請求物件，其 `params` 應包含 `roomId`。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含指定聊天室資訊的 JSON 響應。
 * @throws {NotFoundError} 如果找不到指定 `roomId` 的聊天室。
 */
export async function getMessagesHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { roomId } = req.params;

		const messages = await messagesDB.findMessagesByRoomId(roomId);
		if (!messages) throw new NotFoundError("聊天室不存在");

		res.status(200).json({
			success: true,
			message: "成功獲取指定聊天室 id 的聊天室訊息",
			data: messages,
		});
	} catch (error) {
		next(error);
	}
}
