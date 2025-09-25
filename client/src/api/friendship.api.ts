import {
	FriendshipResponseSchema,
	type FriendshipDto,
	type TargetUserSchemaType,
	type RequesterSchemaType,
	ApiResponseSchema,
} from "@convo/shared";
import axiosClient from "./client";

export const friendshipService = {
	// 獲取用戶好友列表
	getUserFriends: async (): Promise<FriendshipDto[]> => {
		const { data } = await axiosClient.get("/friendships");
		const validatedData = FriendshipResponseSchema.parse(data);
		return validatedData.data;
	},

	// 發送好友邀請
	sendFriendRequest: async (targetUserId: string): Promise<void> => {
		const payload: TargetUserSchemaType = { targetUserId };
		const { data } = await axiosClient.post(
			"/friendships/send-request",
			payload
		);
		// 驗證 API 響應格式
		ApiResponseSchema.parse(data);
	},

	// 接受好友邀請
	acceptFriendRequest: async (requesterId: string): Promise<void> => {
		const payload: RequesterSchemaType = { requesterId };
		const { data } = await axiosClient.post(
			"/friendships/accept-request",
			payload
		);
		ApiResponseSchema.parse(data);
	},

	// 取消好友邀請
	cancelFriendRequest: async (targetUserId: string): Promise<void> => {
		const payload: TargetUserSchemaType = { targetUserId };
		const { data } = await axiosClient.delete("/friendships/cancel-request", {
			data: payload,
		});
		ApiResponseSchema.parse(data);
	},

	// 封鎖用戶
	blockUser: async (targetUserId: string): Promise<void> => {
		const payload: TargetUserSchemaType = { targetUserId };
		const { data } = await axiosClient.post("/friendships/block-user", payload);
		ApiResponseSchema.parse(data);
	},

	// 獲取好友邀請列表
	getFriendRequests: async () => {
		const { data } = await axiosClient.get("/friendships/requests");
		// 後端返回格式: { success: boolean, message: string, data: [...] }
		// 直接返回後端響應，前端處理
		return data;
	},

	// 解除好友關係 (後端路由暫未實現，先註釋)
	// unfriend: async (targetUserId: string): Promise<void> => {
	// 	const payload: TargetUserSchemaType = { targetUserId };
	// 	await axiosClient.delete("/friendships/unfriend", { data: payload });
	// 	// unfriend API 返回 204 No Content，不需要解析響應
	// },
};
