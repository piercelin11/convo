import { EditProfileSchemaType, SearchUserSchema } from "@convo/shared";
import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "@/utils/error.utils.js";
import * as userDB from "@/db/users.db.js";
import * as userService from "@/services/user.service.js";
import { Console } from "console";
import { date, success } from "zod/v4";

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

export async function searchUsers(
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log("error");
	try {
		// 1.驗證參數
		const { q } = SearchUserSchema.parse(req.query);
		console.log(q);

		// 2.執行資料庫搜尋
		const users = await userDB.searchUsersByUsername(q);
		// 3. 回傳成功響應
		res.status(200).json({
			success: true,
			message: "已搜尋使用者姓名",
			data: users,
		});
	} catch (err) {
		next(err);
	}
}
