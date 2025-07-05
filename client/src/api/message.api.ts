import { MessageResponseSchema, type MessageDto } from "@convo/shared";
import axiosClient from "./client";

export const messageService = {
	getMessagesByRoomId: async (roomId: string): Promise<MessageDto[]> => {
		const { data } = await axiosClient.get(`/messages/${roomId}`);
		const validatedData = MessageResponseSchema.parse(data);
		return validatedData.data;
	},
};
