import * as chatRoomsDB from "@/db/chatRooms.db.js";
import { AuthorizationError } from "@/utils/error.utils.js";
import { CreateGroupChatSchemaType } from "@convo/shared";
import { Request, Response } from "express";

export async function handleUsersChatRoom(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const chatRooms = await chatRoomsDB.findChatRoomByUserId(user.id);

	res.status(200).json({
		success: true,
		message: "成功獲取使用者的全部聊天室",
		chatRooms,
	});
}

export async function handleCreateGroupChat(req: Request, res: Response) {
	const user = req.user;
	const { name, members } = req.body as CreateGroupChatSchemaType;
	if (!user) throw new AuthorizationError();

	const chatRooms = await chatRoomsDB.createGroupChat(name, user.id, members);

	res.status(200).json({
		success: true,
		message: "成功創建聊天室",
		chatRooms,
	});
}
