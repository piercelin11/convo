import { z } from "zod/v4";
import { usernameSchema, passwordSchema, emailSchema } from "./common.schema";

export const loginSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		username: usernameSchema,
		email: emailSchema,
		password: passwordSchema,
		comfirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.comfirmPassword, {
		message: "確認密碼與密碼不符",
		path: ["comfirmPassword"],
	});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
