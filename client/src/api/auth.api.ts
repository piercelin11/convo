import {
	AuthResponseSchema,
	type AuthResponseType,
	type LoginSchemaType,
	type RegisterSchemaType,
} from "@convo/shared";
import axiosClient from "./client";

export const authService = {
	login: async (credentials: LoginSchemaType): Promise<AuthResponseType> => {
		const { data } = await axiosClient.post("/auth/login", credentials);
		return AuthResponseSchema.parse(data);
	},
	register: async (
		credentials: RegisterSchemaType
	): Promise<AuthResponseType> => {
		const { data } = await axiosClient.post("/auth/register", credentials);
		return AuthResponseSchema.parse(data);
	},
	logout: async (): Promise<AuthResponseType> => {
		const { data } = await axiosClient.post("/auth/logout");
		return AuthResponseSchema.parse(data);
	},
	getSession: async (): Promise<AuthResponseType> => {
		const { data } = await axiosClient.get("/auth/session");
		return AuthResponseSchema.parse(data);
	},
};
