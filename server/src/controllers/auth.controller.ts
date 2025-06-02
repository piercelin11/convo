import { LoginResponseType } from "@convo/shared";
import { NextFunction, Request, Response } from "express";
import { authenticateUserLogin } from "@/services/auth.service.js";

export default async function handleLoginasync(
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
		if (error instanceof Error) {
			if (error.message === "帳號或密碼不正確") {
				response = {
					success: false,
					message: "帳號或密碼不正確",
				};
				console.error("[登入]帳號或密碼不正確");
				res.status(401).json(response);
				return;
			}
		}
		next(error);
	}
}
