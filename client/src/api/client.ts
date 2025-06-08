import { env } from "@/config/env";
import axios from "axios";

const axiosClient = axios.create({
	baseURL: `${env.VITE_API_DATABASE_URL}/api`,
	timeout: 10000,
	withCredentials: true,
});

axiosClient.interceptors.request.use(
	(config) => {
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
		return Promise.reject(error);
	}
);

export default axiosClient;
