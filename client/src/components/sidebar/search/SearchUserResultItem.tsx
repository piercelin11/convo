import Avatar from "@/components/ui/Avatar";
import { env } from "@/config/env";
import { useSendFriendRequest } from "@/queries/friendship/useFriendshipQuery";
import { useState } from "react";

type SearchUserResultItemProps = {
	userId: string;
	imgUrl: string | null;
	title: string | null;
	content?: string;
	friendshipStatus: "pending" | "accepted" | "blocked" | null;
};

export default function SearchUserResultItem({
	userId,
	imgUrl,
	title,
	content,
	friendshipStatus,
}: SearchUserResultItemProps) {
	const sendFriendRequestMutation = useSendFriendRequest();
	const [requestSent, setRequestSent] = useState(false);

	const handleSendFriendRequest = async () => {
		try {
			await sendFriendRequestMutation.mutateAsync(userId);
			setRequestSent(true);
		} catch (error) {
			console.error("發送好友邀請失敗:", error);
		}
	};

	const renderActionButton = () => {
		// 如果已經是好友
		if (friendshipStatus === "accepted") {
			return (
				<span className="rounded-full bg-green-600 px-3 py-1 text-sm text-white">
					好友
				</span>
			);
		}

		// 如果已經發送邀請但還在等待中
		if (friendshipStatus === "pending" || requestSent) {
			return (
				<span className="rounded-full bg-gray-600 px-3 py-1 text-sm text-gray-300">
					已送出
				</span>
			);
		}

		// 如果被封鎖
		if (friendshipStatus === "blocked") {
			return (
				<span className="rounded-full bg-red-600 px-3 py-1 text-sm text-white">
					已封鎖
				</span>
			);
		}

		// 如果可以加好友（沒有友誼關係）
		return (
			<button
				onClick={handleSendFriendRequest}
				disabled={sendFriendRequestMutation.isPending}
				className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
			>
				{sendFriendRequestMutation.isPending ? "發送中..." : "加好友"}
			</button>
		);
	};

	return (
		<li className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-800">
			<Avatar src={imgUrl || env.VITE_USER_IMG_PLACEHOLDER} size={55} />
			<div className="flex-1 overflow-hidden pr-2">
				<div className="flex items-center justify-between">
					<p>{title}</p>
					{renderActionButton()}
				</div>
				<div className="flex gap-4">
					<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
						{content}
					</p>
				</div>
			</div>
		</li>
	);
}
