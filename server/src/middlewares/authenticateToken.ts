import { env } from "@/config/env.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
		console.error("[身份驗證]令牌無效或已過期:", error);
		res.status(403).json({ message: "Token is unauthorized or expired." });
		return;
	}

	return next();
}
