import { env } from "@/config/env.js";
import { AuthorizationError } from "@/utils/error.utils.js";
import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

/**
 * JWT 的使用者 Payload
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
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Unauthorized request." });
		return;
	}

	try {
		const userPayload = jwt.verify(token, env.JWT_PRIVATE_KEY);
		req.user = userPayload as UserPayloadType;
	} catch (error) {
		console.warn("[權限驗證中間件]權限驗證失敗");
		if (error instanceof JsonWebTokenError) {
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
