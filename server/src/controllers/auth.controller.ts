import {
	AuthResponseType,
	LoginSchemaType,
	RegisterSchemaType,
} from "@convo/shared";
import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "@/services/auth.service.js";

export async function handleLogin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { username, password } = req.body as LoginSchemaType;
	let response: AuthResponseType;

	try {
		const { user, token, userJWTPayload } = await loginUser(username, password);
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

export async function handleRegister(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { username, password, email } = req.body as RegisterSchemaType;
	let response: AuthResponseType;

	try {
		const { user, token, userJWTPayload } = await registerUser(
			username,
			email,
			password
		);
		response = {
			success: true,
			message: "成功註冊並登入",
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
		console.warn("[身份驗證]註冊失敗");
		console.warn(`註冊失敗的使用者名稱: ${username}`);
		next(error);
	}
}
