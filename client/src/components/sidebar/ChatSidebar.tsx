import useMediaQuery from "@/hooks/useMediaQuery";
import ChatRoomItem from "./ChatRoomItem";
import SidebarHeader from "./SidebarHeader";
import { cn } from "@sglara/cn";
import { Link } from "react-router-dom";
import { useChatsQuery } from "@/queries/chat/useChatsQuery";
import Profile from "../profile/Profile";

/**
 * 聊天界面的側邊欄
 * @returns 包含 Header 與聊天室清單的`aside` JSX 元素
 */
export default function ChatSidebar() {
	const isMobile = useMediaQuery("max", 640);
	const { data } = useChatsQuery();

	return (
		<aside
			className={cn(
				"flex h-full flex-col border-r border-neutral-800 bg-neutral-900",
				{
					"w-screen": isMobile,
					"w-sidebar-lg": !isMobile,
				}
			)}
		>
			<SidebarHeader />
			<div
				className="flex-grow overflow-y-auto overscroll-contain p-2"
				tabIndex={-1}
			>
				<ul>
					{data?.map((item) => (
						<Link key={item.id} to={`/${item.id}`}>
							<ChatRoomItem
								name={item.name!}
								updateAt={item.latest_message_at}
								latestMessage={item.latest_message_content}
								imgUrl={item.image_url}
							/>
						</Link>
					))}
				</ul>
			</div>
			<Profile />
		</aside>
	);
}
