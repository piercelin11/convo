import type { LoginResponseType, LoginSchemaType } from "@convo/shared";
import axios from "axios";

const axiosClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_DATABASE_URL}/api`,
	timeout: 10000,
});

export const authService = {
	login: async (credentials: LoginSchemaType): Promise<LoginResponseType> => {
		const response = await axiosClient.post("/auth/login", credentials);
		return response.data;
	},
};
