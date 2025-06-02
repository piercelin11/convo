import type { LoginResponseType, LoginSchemaType } from "@convo/shared";
import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_DATABASE_URL}/api`,
	timeout: 10000,
});

axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");

		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error instanceof AxiosError) {
			if (error.response?.status === 401 || error.response?.status === 403) {
				localStorage.removeItem("authToken");
				localStorage.removeItem("expiredIn");
				localStorage.removeItem("user");
			}
		}
		return Promise.reject(error);
	}
);

export const authService = {
	login: async (credentials: LoginSchemaType): Promise<LoginResponseType> => {
		const response = await axiosClient.post("/auth/login", credentials);
		return response.data;
	},
};
