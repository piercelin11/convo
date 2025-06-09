import {
	AuthResponseType,
	LoginSchemaType,
	RegisterSchemaType,
} from "@convo/shared";
import { NextFunction, Request, Response } from "express";
import {
	getUserSession,
	loginUser,
	registerUser,
} from "@/services/auth.service.js";
import { AuthorizationError } from "@/utils/index.js";

export async function handleLogin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { username, password } = req.body as LoginSchemaType;
	let response: AuthResponseType;

	try {
		const { user, token } = await loginUser(username, password);

		response = {
			success: true,
			message: "成功登入",
			data: user,
		};

		res.cookie("authToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 24 * 60 * 60 * 1000,
		});
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
		const { user, token } = await registerUser(username, email, password);

		response = {
			success: true,
			message: "成功註冊並登入",
			data: user,
		};

		res.cookie("authToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(200).json(response);
	} catch (error) {
		console.warn("[身份驗證]註冊失敗");
		console.warn(`註冊失敗的使用者名稱: ${username}`);
		next(error);
	}
}

export async function handleLogout(req: Request, res: Response) {
	res.clearCookie("authToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
	res.status(200).json({ success: true, message: "成功登出" });
}

export async function handleSession(req: Request, res: Response) {
	const userPayload = req.user;
	if (!userPayload) throw new AuthorizationError();

	const user = await getUserSession(userPayload.id);

	res.status(200).json({ success: true, message: "身份驗證成功", data: user });
}
