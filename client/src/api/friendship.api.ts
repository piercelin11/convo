import { FriendshipResponseSchema, type FriendshipDto } from "@convo/shared";
import axiosClient from "./client";

export const friendshipService = {
	getUserFriends: async (): Promise<FriendshipDto[]> => {
		const { data } = await axiosClient.get("/friendships");
		const validatedData = FriendshipResponseSchema.parse(data);
		return validatedData.data;
	},
};
