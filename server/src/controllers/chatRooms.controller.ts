import { findChatRoomByUserId } from "@/db/chatRooms.db.js";
import { AuthorizationError } from "@/utils/error.utils.js";
import { Request, Response } from "express";

export async function handleUsersChatRoom(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const chatRooms = await findChatRoomByUserId(user.id);

	res.status(200).json({
		success: true,
		message: "成功獲取使用者的全部聊天室",
		chatRooms,
	});
}
