import {
	AuthenticationError,
	AuthorizationError,
	ConflictError,
	DatabaseError,
	InternalServerError,
	NotFoundError,
} from "@/utils/error.utils.js";
import { NextFunction, Request, Response } from "express";
import { success } from "zod/v4";

/**
 * 全局錯誤處理中介軟體。
 * 捕獲應用程式中拋出的各種錯誤，並根據錯誤類型和操作性屬性返回標準化的 HTTP 響應。
 *
 * @param err - 捕獲到的錯誤物件。可能是自定義錯誤類別 (例如 AuthenticationError, AuthorizationError, DatabaseError, NotFoundError, InternalServerError)，也可能是其他未預期的錯誤。
 * @param req - Express 請求物件。
 * @param res - Express 響應物件。
 * @param next - 呼叫下一個中介軟體或路由處理器的回調函式。此參數在此函式中未使用，但為 Express 錯誤處理中介軟體簽名所需。
 */
export default async function errorHandler(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	err: any,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction // next 參數在此函式中未使用
) {
	// 處理 AuthenticationError
	if (err instanceof AuthenticationError && err.isOperational) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	// 處理 AuthorizationError
	if (err instanceof AuthorizationError && err.isOperational) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	// 處理 DatabaseError
	if (err instanceof DatabaseError) {
		if (err.isOperational) {
			res.status(err.statusCode).json({
				success: false,
				message: err.message,
			});
		} else {
			console.error("[嚴重錯誤]資料庫發生非操作性的錯誤！", err);
			res.status(err.statusCode).json({
				success: false,
				message: "資料庫操作失敗，請稍後再試",
			});
		}
		return;
	}

	// 處理 NotFoundError
	if (err instanceof NotFoundError) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	// 處理 InternalServerError (通常用於明確的 500 錯誤)
	if (err instanceof InternalServerError) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	// 處理form的該名稱已被他人使用
	if (err instanceof ConflictError) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	// 處理所有未被上述自定義錯誤類別捕獲的「未預期」錯誤
	console.error("伺服器發生未預期的錯誤:", err);

	// 根據環境決定返回的錯誤訊息
	const errorMessage =
		process.env.NODE_ENV === "production"
			? "伺服器發生未預期錯誤" // 生產環境給通用訊息
			: err.message || "伺服器發生未預期錯誤"; // 開發環境顯示詳細錯誤訊息

	res.status(500).json({
		success: false,
		message: errorMessage,
	});
	return;
}
