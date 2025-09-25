import { useState } from "react";
import Tab from "../ui/Tab";
import Avatar from "../ui/Avatar";
import { env } from "@/config/env";
import Button from "../ui/Button";
import {
	useFriendRequestsQuery,
	useAcceptFriendRequest,
} from "@/queries/friendship/useFriendshipQuery";
import type { FriendshipRequestItemType } from "@convo/shared";

const tabOptions = [
	{ id: "friend-request", label: "好友邀請" },
	{ id: "system-announcement", label: "系統通知" },
] as const;

export default function NotificationModal() {
	const [currentTabId, setCurrrentTabId] =
		useState<(typeof tabOptions)[number]["id"]>("friend-request");

	const {
		data: friendRequestsResponse,
		isLoading,
		isError,
	} = useFriendRequestsQuery();

	const acceptFriendRequestMutation = useAcceptFriendRequest();

	const handleAcceptRequest = async (requesterId: string) => {
		try {
			await acceptFriendRequestMutation.mutateAsync(requesterId);
		} catch (error) {
			console.error("接受好友邀請失敗:", error);
		}
	};

	const renderFriendRequests = () => {
		if (isLoading) return <p className="p-4 text-center">載入中...</p>;
		if (isError)
			return <p className="p-4 text-center text-red-500">載入失敗</p>;

		// 使用真實的 API 資料
		const friendRequests = friendRequestsResponse?.data || [];

		if (friendRequests.length === 0) {
			return <p className="p-4 text-center text-gray-500">暫無好友邀請</p>;
		}

		return friendRequests.map((request: FriendshipRequestItemType) => (
			<li
				key={`${request.requester_id}_${request.addressee_id}`}
				className="flex items-center gap-2 rounded-xl p-2"
			>
				<Avatar
					src={request.avatar_url || env.VITE_USER_IMG_PLACEHOLDER}
					size={55}
				/>
				<div className="flex-1 overflow-hidden pr-2">
					<div className="flex items-center">
						<p>{request.username}</p>
					</div>
					<div className="flex gap-4">
						<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
							想要加你為好友
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => handleAcceptRequest(request.requester_id)}
						disabled={acceptFriendRequestMutation.isPending}
					>
						{acceptFriendRequestMutation.isPending ? "接受中..." : "確認"}
					</Button>
					{/* 暫時隱藏刪除按鈕，因為後端缺少拒絕邀請的 API */}
					{/* <Button variant="secondary">刪除</Button> */}
				</div>
			</li>
		));
	};

	return (
		<section>
			<Tab
				tabOptions={tabOptions}
				currentTabId={currentTabId}
				onTabChange={setCurrrentTabId}
			/>
			<ul className="max-h-80 overflow-y-scroll pt-6">
				{currentTabId === "friend-request" && renderFriendRequests()}
				{currentTabId === "system-announcement" && (
					<p className="p-4 text-center text-gray-500">暫無系統通知</p>
				)}
			</ul>
		</section>
	);
}
