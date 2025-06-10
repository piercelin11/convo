import {
	ChatRoomsResponseSchema,
	ChatRoomResponseSchema,
	type CreateGroupChatSchemaType,
	type ChatRoomRecord,
} from "@convo/shared";
import axiosClient from "./client";

export const chatService = {
	getChatRooms: async (): Promise<ChatRoomRecord[]> => {
		const { data } = await axiosClient.get("/chat-rooms");
		const validatedData = ChatRoomsResponseSchema.parse(data);
		return validatedData.data;
	},
	getChatRoom: async (roomId: string): Promise<ChatRoomRecord> => {
		const { data } = await axiosClient.get(`/chat-rooms/${roomId}`);
		const validatedData = ChatRoomResponseSchema.parse(data);
		return validatedData.data;
	},
	createGroupChat: async (
		formData: CreateGroupChatSchemaType
	): Promise<ChatRoomRecord> => {
		const { data } = await axiosClient.post("/chat-rooms/group", formData);
		const validatedData = ChatRoomResponseSchema.parse(data);
		return validatedData.data;
	},
};
