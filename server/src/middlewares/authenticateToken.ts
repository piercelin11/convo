import { AuthenticationError } from "@/utils/error.utils.js";
import { authenticateAuthToken } from "@/utils/jwt.utils.js";
import { NextFunction, Request, Response } from "express";

/**
 * JWT 的使用者 Payload 型別
 * @property id - 用戶的唯一識別碼 (UUID)。
 * @property username - 用戶名稱。
 * @property email - 用戶的電子郵件。
 * @property [iat] - JWT 的簽發時間戳 (Epoch time)，可選。
 * @property [exp] - JWT 的過期時間戳 (Epoch time)，可選。
 */
export type UserPayloadType = {
	id: string;
	username: string;
	email: string;
	iat?: number;
	exp?: number;
};

/**
 * JWT 權限驗證中介軟體。
 * 負責從請求的 Cookie 中提取認證令牌，驗證其有效性，
 * 並將解碼後的使用者資訊附加到 `req.user` 上，以便後續路由處理器使用。
 *
 * @param req - Express 請求物件，應包含 `authToken` 在 cookies 中。
 * @param res - Express 響應物件。
 * @param next - 呼叫下一個中介軟體或路由處理器的回調函式。
 * @returns 呼叫 `next()` 繼續處理請求。
 * @throws {AuthenticationError} 如果令牌缺失、令牌過期或令牌無效。
 */
export default function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.cookies.authToken;
	try {
		const userPayload = authenticateAuthToken(token);
		req.user = userPayload;
	} catch (error) {
		console.warn("[權限驗證中間件]權限驗證失敗");
		if (error instanceof Error) {
			if (error.name === "TokenExpiredError") {
				throw new AuthenticationError("令牌過期請重新登入");
			}
			if (error.name === "JsonWebTokenError") {
				throw new AuthenticationError("令牌無效");
			}
		}
		next(error);
	}

	return next();
}
