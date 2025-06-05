import { env } from "@/config/env";
import type {
	AuthResponseType,
	LoginSchemaType,
	RegisterSchemaType,
	ChatRoomsResponseType,
	FriendshipsResponseType,
	CreateGroupChatSchemaType,
} from "@convo/shared";
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

export const authService = {
	login: async (credentials: LoginSchemaType): Promise<AuthResponseType> => {
		const response = await axiosClient.post("/auth/login", credentials);
		return response.data;
	},
	register: async (
		credentials: RegisterSchemaType
	): Promise<AuthResponseType> => {
		const response = await axiosClient.post("/auth/register", credentials);
		return response.data;
	},
	logout: async (): Promise<AuthResponseType> => {
		const response = await axiosClient.post("/auth/logout");
		return response.data;
	},
	getSession: async (): Promise<AuthResponseType> => {
		const response = await axiosClient.get("/auth/session");
		return response.data;
	},
};

export const chatRoomsService = {
	getUserChatRooms: async (): Promise<ChatRoomsResponseType> => {
		const response = await axiosClient.get("/chat-rooms");
		return response.data;
	},
	createGroupChat: async (
		formData: CreateGroupChatSchemaType
	): Promise<ChatRoomsResponseType> => {
		const response = await axiosClient.post("/chat-rooms/group", formData);
		return response.data;
	},
};

export const friendshipsService = {
	getUserFriends: async (): Promise<FriendshipsResponseType> => {
		const response = await axiosClient.get("/friendships");
		return response.data;
	},
};
