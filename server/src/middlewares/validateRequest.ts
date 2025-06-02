/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, z, ZodType } from "zod/v4";

type RequestValidationSchemas = {
	body?: ZodType<any>;
	query?: ZodType<any>;
	params?: ZodType<any>;
};

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
