import * as friendshipsDb from "@/db/friendship.db.js";
import { AuthorizationError } from "@/utils/error.utils.js";
import { Request, Response } from "express";

export async function handleGetFriendships(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const friendships = await friendshipsDb.findFriendshipsByUserId(user.id);

	res.status(200).json({
		success: true,
		message: "成功獲取使用者的好友",
		friendships,
	});
}
