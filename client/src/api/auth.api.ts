import {
	AuthResponseSchema,
	type LoginSchemaType,
	type RegisterSchemaType,
	type UserDTO,
} from "@convo/shared";
import axiosClient from "./client";

export const authService = {
	login: async (credentials: LoginSchemaType): Promise<UserDTO> => {
		const { data } = await axiosClient.post("/auth/login", credentials);
		const validatedData = AuthResponseSchema.parse(data);
		return validatedData.data;
	},
	register: async (credentials: RegisterSchemaType): Promise<UserDTO> => {
		const { data } = await axiosClient.post("/auth/register", credentials);
		const validatedData = AuthResponseSchema.parse(data);
		return validatedData.data;
	},
	logout: async (): Promise<UserDTO> => {
		const { data } = await axiosClient.post("/auth/logout");
		const validatedData = AuthResponseSchema.parse(data);
		return validatedData.data;
	},
	getSession: async (): Promise<UserDTO> => {
		const { data } = await axiosClient.get("/auth/session");
		const validatedData = AuthResponseSchema.parse(data);
		return validatedData.data;
	},
};
