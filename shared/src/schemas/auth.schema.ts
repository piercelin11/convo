import { z } from "zod/v4";
import { UserDTO } from "../types/dto.types";
import { usernameSchema, passwordSchema, emailSchema } from "./common.schema";

export const loginSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	username: usernameSchema,
	email: emailSchema,
	password: passwordSchema,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type AuthResponseType = {
	success: boolean;
	message: string;
	token?: string;
	user?: UserDTO;
	expiredAt?: number;
};
