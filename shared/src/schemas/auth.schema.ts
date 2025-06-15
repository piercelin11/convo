import { z } from "zod/v4";
import { UsernameSchema, PasswordSchema, EmailSchema } from "./common.schema";
import { ApiResponseSchema } from "./api.schema";
import { UserDTOSchema, UserDTO } from "./dto.schema";

/**
 * 登入時所需的資料結構。
 */
export const LoginSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
});

/**
 * 登入時所需的資料型別。
 */
export type LoginSchemaType = z.infer<typeof LoginSchema>;

/**
 * 註冊時所需的資料結構。
 */
export const RegisterSchema = z
	.object({
		username: UsernameSchema,
		email: EmailSchema,
		password: PasswordSchema,
		comfirmPassword: PasswordSchema,
	})
	.refine((data) => data.password === data.comfirmPassword, {
		message: "確認密碼與密碼不符",
		path: ["comfirmPassword"],
	});

/**
 * 註冊時所需的資料型別。
 */
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

/**
 * 身份驗證相關的 API 回應資料結構。
 * API 回應中包含使用者的資料結構 {@link UserDTOSchema}。
 */
export const AuthResponseSchema = ApiResponseSchema.extend({
	data: UserDTOSchema,
});

/**
 * 身份驗證相關的 API 回應資料型別。
 * API 回應中包含使用者的資料型別 {@link UserDTO}。
 */
export type AuthResponseType = z.infer<typeof AuthResponseSchema>;
