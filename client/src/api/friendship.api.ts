import { type FriendshipResponseType } from "@convo/shared";
import axiosClient from "./client";

export const friendshipService = {
	getUserFriends: async (): Promise<FriendshipResponseType> => {
		const { data } = await axiosClient.get("/friendships");
		return data;
	},
};
