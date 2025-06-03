import { env } from "@/config/env.js";
import { AuthorizationError } from "@/utils/error.utils.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * JWT 的使用者 Payload 型別
 */
export type UserPayloadType = {
	id: string;
	username: string;
	email: string;
	iat?: number;
	exp?: number;
};

declare global {
	namespace Express {
		interface Request {
			user?: UserPayloadType;
		}
	}
}

export default function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.cookies.authToken;

	if (!token) {
		throw new AuthorizationError("為授權的請求");
	}

	try {
		const userPayload = jwt.verify(token, env.JWT_PRIVATE_KEY);
		req.user = userPayload as UserPayloadType;
	} catch (error) {
		console.warn("[權限驗證中間件]權限驗證失敗");
		if (error instanceof Error) {
			if (error.name === "TokenExpiredError") {
				throw new AuthorizationError("令牌過期請重新登入");
			}
			if (error.name === "JsonWebTokenError") {
				throw new AuthorizationError("令牌無效");
			}
		}
		next(error);
	}

	return next();
}
