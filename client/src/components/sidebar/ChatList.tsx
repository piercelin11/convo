import type { ChatRoomDto } from "@convo/shared";
import ChatRoomItem from "./ChatRoomItem";
import { Link } from "react-router-dom";

type ChatListProps = {
	chatListData: ChatRoomDto[] | undefined;
};

export default function ChatList({ chatListData }: ChatListProps) {
	return (
		<div
			className="flex-grow overflow-y-auto overscroll-contain p-2"
			tabIndex={-1}
		>
			<ul>
				{chatListData?.map((item) => (
					<Link key={item.id} to={`/${item.id}`}>
						<ChatRoomItem roomData={item} />
					</Link>
				))}
			</ul>
		</div>
	);
}
