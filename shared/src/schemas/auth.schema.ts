import { z } from "zod";
import { UserDTO } from "../types/dto.types";

export const loginSchema = z.object({
	username: z
		.string()
		.min(1, { message: "Username needs to be at least 1 character" })
		.max(20, { message: "Username needs to be less than 20 character" }),
	password: z
		.string()
		.min(8, { message: "Password needs to be at least 8 characters" })
		.max(20, { message: "Password needs to be less than 20 character" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export type LoginResponseType = {
	success: boolean;
	message: string;
	token?: string;
	user?: UserDTO;
	expiredAt?: number;
};
