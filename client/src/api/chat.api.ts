import {
	ChatRoomsResponseSchema,
	ChatRoomResponseSchema,
	type CreateChatRoomSchemaType,
	type ChatRoomRecord,
	type EditChatRoomSchemaType,
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
	deleteChatRoom: async (roomId: string): Promise<ChatRoomRecord> => {
		const { data } = await axiosClient.delete(`/chat-rooms/${roomId}`);
		const validatedData = ChatRoomResponseSchema.parse(data);
		return validatedData.data;
	},
	createChatRoom: async (
		formData: CreateChatRoomSchemaType
	): Promise<ChatRoomRecord> => {
		const { data } = await axiosClient.post("/chat-rooms/group", formData);
		const validatedData = ChatRoomResponseSchema.parse(data);
		return validatedData.data;
	},
	editChatRoom: async (
		formData: EditChatRoomSchemaType
	): Promise<ChatRoomRecord> => {
		const { data } = await axiosClient.put("/chat-rooms/group", formData);
		const validatedData = ChatRoomResponseSchema.parse(data);
		return validatedData.data;
	},
};
