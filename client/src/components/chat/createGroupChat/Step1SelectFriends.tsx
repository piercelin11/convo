import { friendshipService } from "@/api";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import type { FriendshipDto } from "@convo/shared";
import { useEffect, useState } from "react";

type Step1SelectFriendsProps = {
	selectedFriends: FriendshipDto[];
	setSelectedFriends: React.Dispatch<React.SetStateAction<FriendshipDto[]>>;
	nextStep: () => void;
};

export default function Step1SelectFriends({
	selectedFriends,
	setSelectedFriends,
	nextStep,
}: Step1SelectFriendsProps) {
	const [friends, setFriends] = useState<FriendshipDto[]>([]);
	const selectedIds = selectedFriends.map((user) => user.id);

	function handleClick(user: FriendshipDto) {
		if (selectedIds.includes(user.id)) {
			setSelectedFriends(
				selectedFriends.filter((selectedUser) => selectedUser.id !== user.id)
			);
		} else {
			setSelectedFriends((prev) => [...prev, user]);
		}
	}
	useEffect(() => {
		async function fetchFriends() {
			try {
				const response = await friendshipService.getUserFriends();
				setFriends(response.friendships);
			} catch (error) {
				console.error("[CreateChatRoomForm]獲取好友關係時發生錯誤:", error);
			}
		}
		fetchFriends();
	}, []);
	return (
		<>
			<h1 className="text-neutral-300">Select Friends</h1>
			<div className="space-y-2">
				{friends.map((friend) => (
					<div
						key={friend.id}
						className="flex items-center gap-2 rounded-md select-none"
						onClick={() => handleClick(friend)}
					>
						<Avatar src={friend.avatar_url} />
						<p>{friend.username}</p>
						<CheckBox
							className="ml-auto"
							checked={selectedIds.includes(friend.id)}
						/>
					</div>
				))}
			</div>
			<Button className="mt-auto" onClick={nextStep}>
				Next Step
			</Button>
		</>
	);
}
