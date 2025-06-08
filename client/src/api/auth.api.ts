import {
	type AuthResponseType,
	type LoginSchemaType,
	type RegisterSchemaType,
} from "@convo/shared";
import axiosClient from "./client";

export const authService = {
	login: async (credentials: LoginSchemaType): Promise<AuthResponseType> => {
		const { data } = await axiosClient.post("/auth/login", credentials);
		return data;
	},
	register: async (
		credentials: RegisterSchemaType
	): Promise<AuthResponseType> => {
		const { data } = await axiosClient.post("/auth/register", credentials);
		return data;
	},
	logout: async (): Promise<AuthResponseType> => {
		const { data } = await axiosClient.post("/auth/logout");
		return data;
	},
	getSession: async (): Promise<AuthResponseType> => {
		const { data } = await axiosClient.get("/auth/session");
		return data;
	},
};
