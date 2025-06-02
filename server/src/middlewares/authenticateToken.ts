import { env } from "@/config/env.js";
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
		if (error instanceof JsonWebTokenError) {
			if (error.name === "TokenExpiredError") {
				console.error("[身份驗證]Token 已過期:", error);
				res.status(401).json({ success: false, message: "令牌過期請重新登入" });
				return;
			}
			if (error.name === "JsonWebTokenError") {
				console.error("[身份驗證]Token 無效。:", error);
				res.status(401).json({ success: false, message: "令牌無效" });
				return;
			}
		}
		next(error);
	}

	return next();
}
