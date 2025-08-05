import * as chatRoomsDB from "@/db/chatRooms.db.js";
import * as membersDB from "@/db/members.db.js";
import * as chatRoomsService from "@/services/chatRooms.service.js"; // 服務層導入
import { AuthorizationError, NotFoundError } from "@/utils/error.utils.js"; // 錯誤類別導入
import {
	CreateChatRoomSchemaType,
	EditChatRoomSchemaType,
	ReadChatRoomSchemaType,
} from "@convo/shared"; // 共享型別導入
import { Request, Response, NextFunction } from "express"; // 導入 NextFunction

/**
 * 處理獲取使用者所有聊天室的請求。
 * 驗證使用者身份後，從資料庫中獲取該使用者所屬的所有聊天室列表。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 中介軟體附加的 `req.user`。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。 (如果你的控制器會包裹在 try...catch 中)
 * @returns 包含聊天室列表的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權。
 */
export async function getChatRoomsHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const user = req.user;
	if (!user) throw new AuthorizationError();
	try {
		const chatRooms = await chatRoomsDB.findChatRoomsByUserId(user.id);

		res.status(200).json({
			success: true,
			message: "成功獲取使用者的全部聊天室",
			data: chatRooms,
		});
	} catch (error) {
		console.error(`獲取用戶 ${user.username} 的聊天室時發生錯誤`, error);
		next(error);
	}
}

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
export async function getChatRoomHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { roomId } = req.params;

		const chatRoom = await chatRoomsDB.findChatRoomByRoomId(roomId);
		if (!chatRoom) throw new NotFoundError("聊天室不存在");

		res.status(200).json({
			success: true,
			message: "成功獲取指定 id 的聊天室",
			data: chatRoom,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 處理創建新聊天室的請求。
 * 驗證使用者身份，並根據請求體中的資料創建一個新的聊天室，包括其成員和（可選的）頭貼圖片。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 附加的 `req.user`，且 `body` 應包含 `CreateChatRoomSchemaType` 驗證過的聊天室名稱、成員ID及圖片URL。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含新創建聊天室資訊的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權。
 */
export async function createChatRoomHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = req.user;
		// 請求體已通過 validateRequest 驗證為 CreateChatRoomSchemaType
		const { name, members, img } = req.body as CreateChatRoomSchemaType;
		if (!user) throw new AuthorizationError(); // 確保用戶已認證

		// 調用服務層服務來創建聊天室
		const newChatRoom = await chatRoomsService.createChatRoom(
			name,
			user.id,
			members,
			img
		);

		res.status(200).json({
			success: true,
			message: "成功創建聊天室",
			data: newChatRoom,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 處理編輯指定聊天室資訊的請求。
 * 驗證使用者權限，並根據請求體中的資料更新聊天室的名稱和圖片。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 附加的 `req.user`，且 `body` 應包含 `EditChatRoomSchemaType` 驗證過的聊天室ID、名稱及圖片URL。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含更新後聊天室資訊的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權或沒有編輯權限。
 * @throws {NotFoundError} 如果聊天室不存在。
 */
export async function editChatRoomHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = req.user;
		const { id: roomId, name, img } = req.body as EditChatRoomSchemaType;
		if (!user) throw new AuthorizationError();

		const updatedChatRoom = await chatRoomsService.editChatRoom(
			roomId,
			user.id,
			name,
			img
		);

		res.status(200).json({
			success: true,
			message: "成功更新聊天室",
			data: updatedChatRoom,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 處理刪除指定聊天室的請求。
 * 驗證使用者權限，並根據路由參數中的 `roomId` 刪除聊天室及其相關聯的資料。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 附加的 `req.user`，且 `params` 應包含 `roomId`。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含成功刪除訊息和被刪除聊天室資訊的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權或沒有刪除權限。
 * @throws {NotFoundError} 如果聊天室不存在。
 */
export async function deleteChatRoomHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = req.user;
		if (!user) throw new AuthorizationError();
		const { roomId } = req.params;

		const deletedChatRoom = await chatRoomsService.deleteChatRoom(
			roomId,
			user.id
		);

		res.status(200).json({
			success: true,
			message: "成功刪除聊天室",
			data: deletedChatRoom,
		});
	} catch (error) {
		next(error);
	}
}

/**
 * 處理已讀聊天室訊息的請求。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 附加的 `req.user`，且 `body` 應包含 `CreateChatRoomSchemaType` 驗證過的聊天室名稱、成員ID及圖片URL。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含新創建聊天室資訊的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權。
 */
export async function readRoomHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = req.user;
		const { id: rommId } = req.body as ReadChatRoomSchemaType;
		if (!user) throw new AuthorizationError(); // 確保用戶已認證

		await membersDB.updateLastReadAt(rommId, user.id);

		res.status(200).json({
			success: true,
			message: "成功已讀聊天室",
		});
	} catch (error) {
		next(error);
	}
}
