import * as chatRoomsDB from "@/db/chatRooms.db.js";
import { AuthorizationError, NotFoundError } from "@/utils/error.utils.js";
import { CreateGroupChatSchemaType } from "@convo/shared";
import { Request, Response } from "express";

export async function getChatRoomsHandler(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const chatRooms = await chatRoomsDB.findChatRoomsByUserId(user.id);

	res.status(200).json({
		success: true,
		message: "成功獲取使用者的全部聊天室",
		data: chatRooms,
	});
}

export async function getChatRoomHandler(req: Request, res: Response) {
	const { roomId } = req.params;

	const chatRoom = await chatRoomsDB.findChatRoomByRoomId(roomId);
	if (!chatRoom) throw new NotFoundError("聊天室不存在");

	res.status(200).json({
		success: true,
		message: "成功獲取指定 id 的聊天室",
		data: chatRoom,
	});
}

export async function createChatRoomHandler(req: Request, res: Response) {
	const user = req.user;
	const { name, members, img } = req.body as CreateGroupChatSchemaType;
	if (!user) throw new AuthorizationError();

	const chatRooms = await chatRoomsDB.createGroupChat(
		name,
		user.id,
		members,
		img
	);

	res.status(200).json({
		success: true,
		message: "成功創建聊天室",
		data: chatRooms,
	});
}

export async function deleteChatRoomHandler(req: Request, res: Response) {
	const { roomId } = req.params;

	const chatRoom = await chatRoomsDB.deleteChatRoomByRoomId(roomId);
	if (!chatRoom) throw new NotFoundError("聊天室不存在");

	res.status(200).json({
		success: true,
		message: "成功刪除聊天室",
		data: chatRoom,
	});
}
