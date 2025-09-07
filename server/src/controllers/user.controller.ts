import { EditProfileSchemaType } from "@convo/shared";
import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "@/utils/error.utils.js";
import * as userDB from "@/db/users.db.js";
import * as userService from "@/services/user.service.js";

export async function editUserHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { username, age } = req.body as EditProfileSchemaType;

		// 找出使用者
		const userId = req.user?.id;
		if (!userId) throw new AuthorizationError();

		const updateUserResult = await userService.editUserProfile(
			userId,
			username,
			age
		);
		res.status(200).json({
			success: true,
			message: "使用者資料已更新",
			data: updateUserResult,
		});
	} catch (err) {
		next(err);
	}
}

export async function getUserHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userId } = req.params;

		const updateUserResult = await userService.getUserData(userId);

		res.status(200).json({
			success: true,
			message: "使用者資料已獲得",
			data: updateUserResult,
		});
	} catch (err) {
		next(err);
	}
}
