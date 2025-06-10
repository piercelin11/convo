import { z } from "zod/v4";
import { UsernameSchema, PasswordSchema, EmailSchema } from "./common.schema";
import { ApiResponseSchema } from "./api.schema";
import { UserDTOSchema } from "./dto.schema";

export const LoginSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

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

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const AuthResponseSchema = ApiResponseSchema.extend({
	data: UserDTOSchema,
});

export type AuthResponseType = z.infer<typeof AuthResponseSchema>;
