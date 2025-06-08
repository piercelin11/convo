import {
	type ChatResponseType,
	type CreateGroupChatSchemaType,
} from "@convo/shared";
import axiosClient from "./client";

export const chatService = {
	getUserChatRooms: async (): Promise<ChatResponseType> => {
		const { data } = await axiosClient.get("/chat-rooms");
		//console.log(data);
		return data;
	},
	createGroupChat: async (
		formData: CreateGroupChatSchemaType
	): Promise<ChatResponseType> => {
		const { data } = await axiosClient.post("/chat-rooms/group", formData);
		return data;
	},
};
