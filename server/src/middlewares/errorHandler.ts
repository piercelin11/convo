import {
	AuthenticationError,
	AuthorizationError,
	DatabaseError,
} from "@/utils/error.utils.js";
import { NextFunction, Request, Response } from "express";

export default async function errorHandler(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	err: any,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction
) {
	if (err instanceof AuthenticationError && err.isOperational) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	if (err instanceof AuthorizationError && err.isOperational) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	if (err instanceof DatabaseError) {
		if (err.isOperational) {
			res.status(err.statusCode).json({
				success: false,
				message: err.message,
			});
		} else {
			console.error("[嚴重錯誤]資料庫發生非操作性的錯誤！");
			res.status(err.statusCode).json({
				success: false,
				message: err.message,
			});
		}
		return;
	}

	console.error("伺服器發生未預期的錯誤:", err);
	res.status(500).json({
		success: false,
		message:
			process.env.NODE_ENV === "production"
				? "伺服器發生未預期錯誤"
				: err.message || "伺服器發生未預期錯誤",
	});
	return;
}
