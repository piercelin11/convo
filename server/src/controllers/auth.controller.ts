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
import { AuthenticationError } from "@/utils/index.js";

/**
 * 處理使用者登入請求。
 * 驗證提供的使用者名稱和密碼，如果成功則生成認證令牌並設置為 HTTP Cookie，同時返回使用者資訊。
 *
 * @param req - Express 請求物件，其 `body` 應包含 `LoginSchemaType` 驗證過的使用者名稱和密碼。
 * @param res - Express 響應物件，用於設置 Cookie 和發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 */
export async function loginHandler(
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

/**
 * 處理使用者註冊請求。
 * 創建新的使用者帳戶，如果成功則生成認證令牌並設置為 HTTP Cookie，同時返回新使用者資訊。
 *
 * @param req - Express 請求物件，其 `body` 應包含 `RegisterSchemaType` 驗證過的使用者名稱、電子郵件和密碼。
 * @param res - Express 響應物件，用於設置 Cookie 和發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 */
export async function registerHandler(
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

/**
 * 處理使用者登出請求。
 * 清除認證令牌 Cookie，使使用者會話失效。
 *
 * @param req - Express 請求物件。
 * @param res - Express 響應物件，用於清除 Cookie 和發送 JSON 響應。
 */
export async function logoutHandler(req: Request, res: Response) {
	res.clearCookie("authToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
	res.status(200).json({ success: true, message: "成功登出" });
}

/**
 * 處理獲取使用者會話資訊的請求。
 * 驗證請求中附帶的使用者令牌，並返回該使用者的詳細會話資訊。
 *
 * @param req - Express 請求物件，應包含已由 `authenticateToken` 中介軟體附加的 `req.user`。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @returns 包含使用者會話資訊的 JSON 響應。
 * @throws {AuthenticationError} 如果 `req.user` 不存在 (表示未通過認證中介軟體)。
 */
export async function getUserSessionHandler(req: Request, res: Response) {
	const userPayload = req.user;
	if (!userPayload) throw new AuthenticationError();

	const user = await getUserSession(userPayload.id);

	res.status(200).json({ success: true, message: "身份驗證成功", data: user });
}
