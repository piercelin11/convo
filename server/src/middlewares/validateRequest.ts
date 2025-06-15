/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, z, ZodType } from "zod/v4";

type RequestValidationSchemas = {
	body?: ZodType<any>;
	query?: ZodType<any>;
	params?: ZodType<any>;
};

/**
 * 通用請求數據驗證中介軟體。
 * 根據提供的 Zod schemas 驗證請求的 `body`、`query` 和 `params`。
 * 如果驗證成功，會將驗證後的數據賦值回 `req` 物件對應的屬性上。
 * 如果驗證失敗，則會發送 400 Bad Request 響應並包含詳細的驗證錯誤資訊。
 *
 * @param schemas - 包含 `body`、`query` 和/或 `params` 的 Zod schema 物件。
 * @returns Express 中介軟體函式。
 */
export function validateRequest<S extends RequestValidationSchemas>(
	schemas: S
) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			if (schemas.body) {
				req.body = await schemas.body.parseAsync(req.body);
			}
			if (schemas.params) {
				req.params = (await schemas.params.parseAsync(req.params)) as any;
			}
			if (schemas.query) {
				req.query = (await schemas.query.parseAsync(req.query)) as any;
			}
			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				res.status(400).json({
					message: "請求數據驗證失敗",
					errors: error.issues.map((err) => ({
						path: err.path.join("."),
						message: err.message,
					})),
				});
				return;
			}

			return next(error);
		}
	} as RequestHandler<
		S["params"] extends ZodType<any> ? z.infer<S["params"]> : any,
		any,
		S["body"] extends ZodType<any> ? z.infer<S["body"]> : any,
		S["query"] extends ZodType<any> ? z.infer<S["query"]> : any
	>;
}
