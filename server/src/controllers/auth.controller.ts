import { LoginResponseType } from "@convo/shared";
import { NextFunction, Request, Response } from "express";
import { authenticateUserLogin } from "@/services/auth.service.js";

export async function handleLogin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { username, password } = req.body;
	let response: LoginResponseType;

	try {
		const { user, token, userJWTPayload } = await authenticateUserLogin(
			username,
			password
		);
		response = {
			success: true,
			message: "成功登入",
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				age: user.age,
				avatar_url: user.avatar_url,
			},
			token,
			expiredAt: userJWTPayload.exp,
		};
		res.status(200).json(response);
	} catch (error) {
		console.warn("[身份驗證]登入失敗");
		console.warn(`登入失敗的使用者名稱: ${username}`);
		next(error);
	}
}
