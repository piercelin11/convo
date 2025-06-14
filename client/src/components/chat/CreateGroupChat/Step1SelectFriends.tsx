import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import { useFriendshipQuery } from "@/queries/friendship/useFriendshipQuery";
import type { FriendshipDto } from "@convo/shared";

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
	const selectedIds = selectedFriends.map((user) => user.id);

	const { data } = useFriendshipQuery();

	function handleClick(user: FriendshipDto) {
		if (selectedIds.includes(user.id)) {
			setSelectedFriends(
				selectedFriends.filter((selectedUser) => selectedUser.id !== user.id)
			);
		} else {
			setSelectedFriends((prev) => [...prev, user]);
		}
	}

	return (
		<>
			<p className="text-neutral-400">選擇好友</p>
			<div className="space-y-2 pb-26">
				{data?.map((friend) => (
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
			<div className="absolute bottom-0 left-0 mt-auto w-full bg-neutral-900 p-6">
				<Button onClick={nextStep}>下一步</Button>
			</div>
		</>
	);
}
