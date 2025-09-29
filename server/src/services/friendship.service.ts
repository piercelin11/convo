import * as FriendshipDb from "@/db/friendship.db.js";
import {
	AuthorizationError,
	ConflictError,
	NotFoundError,
} from "@/utils/error.utils.js";

interface CreateFriendshipRequestParams {
	requesterId: string;
	targetUserId: string;
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * 處理建立好友邀請
 */
export const createFriendshipRequest = async ({
	requesterId,
	targetUserId,
}: CreateFriendshipRequestParams) => {
	// 規則 1: 使用者不能加自己為好友
	if (requesterId === targetUserId) {
		throw new ConflictError("You cannot send a friend request to yourself.");
	}

	// 規則 2: 檢查兩人之間是否已存在任何關係
	const existingFriendship = await FriendshipDb.findFriendshipBetweenUsers({
		userId1: requesterId,
		userId2: targetUserId,
	});

	if (existingFriendship) {
		if (existingFriendship.status === "accepted") {
			throw new ConflictError("You are already friends.");
		}
		if (existingFriendship.status === "pending") {
			throw new ConflictError("A friend request is already pending.");
		}
		if (existingFriendship.status === "blocked") {
			throw new ConflictError("You have blocked this user.");
		}
	}

	// 規則 3: 如果檢查通過，就建立一個新的邀請
	const newFriendship = await FriendshipDb.createFriendship({
		requesterId,
		addresseeId: targetUserId,
		status: "pending",
	});

	return newFriendship;
};

/**
 * 接受好友邀請
 */

interface AcceptFriendshipRequestParams {
	requesterId: string;
	addresseeId: string;
}

export const acceptFriendshipRequest = async ({
	requesterId,
	addresseeId,
}: AcceptFriendshipRequestParams) => {
	// 1.尋找跟此清求相關的邀請
	const pendingRequest = await FriendshipDb.findFriendshipBetweenUsers({
		userId1: requesterId,
		userId2: addresseeId,
	});

	// 2.如果找不到，表示邀請不存在或已處理
	if (!pendingRequest) {
		throw new NotFoundError("Friend request not found or already handled.");
	}

	// 3. 驗證是否為待處理的邀請，且接受者是本人
	if (
		pendingRequest.status !== "pending" ||
		pendingRequest.addressee_id !== addresseeId
	) {
		throw new AuthorizationError(
			"You do not have permission to accept this friend request."
		);
	}

	//4.更新狀態為accepted
	const updatedFriendship = await FriendshipDb.updateFriendshipStatusById({
		requesterId,
		addresseeId,
		status: "accepted",
	});

	return updatedFriendship;
};

/**
 * 取消好友邀請
 */

interface CancelFriendshipRequestParams {
	requesterId: string;
	targetUserId: string;
}

export const cancelFriendshipRequest = async ({
	requesterId,
	targetUserId,
}: CancelFriendshipRequestParams) => {
	// 1.尋找使用者發給對方、待處理的邀請
	const pendingRequest = await FriendshipDb.findFriendshipBetweenUsers({
		userId1: requesterId,
		userId2: targetUserId,
	});

	// 2.如果找不到，表示邀請不存在或已處理
	if (!pendingRequest) {
		throw new NotFoundError("Friend request not found or already handled.");
	}

	// 3. 驗證是否為待處理的邀請，且是本人進行取消
	if (
		pendingRequest.status !== "pending" ||
		pendingRequest.requester_id !== requesterId
	) {
		throw new AuthorizationError(
			"You do not have permission to cancel this friend request."
		);
	}

	// 3. 從資料庫中刪除這筆邀請
	await FriendshipDb.deleteFriendship({
		requesterId,
		addresseeId: targetUserId,
	});
};

/**
 * 刪除好友
 */

interface DeleteFriendParams {
	requesterId: string;
	targetUserId: string;
}

export const deleteFriend = async ({
	requesterId,
	targetUserId,
}: DeleteFriendParams) => {
	// 1.查找友誼
	const friendship = await FriendshipDb.findFriendshipBetweenUsers({
		userId1: requesterId,
		userId2: targetUserId,
	});

	// 2.檢驗是否真的是好友
	if (!friendship || friendship.status !== "accepted") {
		throw new NotFoundError("You are not friends with this user.");
	}

	// 3.刪除好友
	await FriendshipDb.deleteFriendship({
		requesterId,
		addresseeId: targetUserId,
	});
};

/**
 * 封鎖使用者
 */

interface BlockUserParams {
	requesterId: string;
	targetUserId: string;
}

export const blockUser = async ({
	requesterId,
	targetUserId,
}: BlockUserParams) => {
	// 1.使用者不能封鎖自己
	if (requesterId === targetUserId) {
		throw new ConflictError("You cannot block yourself.");
	}

	// 2.檢查是否曾為朋友
	const existingFriendship = await FriendshipDb.findFriendshipBetweenUsers({
		userId1: requesterId,
		userId2: targetUserId,
	});

	//3.如果存在，先刪除友誼紀錄
	if (existingFriendship) {
		await FriendshipDb.deleteFriendship({
			requesterId: existingFriendship.requester_id,
			addresseeId: existingFriendship.addressee_id,
		});
	}

	// 4.新增一筆狀態為block的關係

	const blockedRelationship = await FriendshipDb.createFriendship({
		requesterId,
		addresseeId: targetUserId,
		status: "blocked",
	});

	return blockedRelationship;
};
