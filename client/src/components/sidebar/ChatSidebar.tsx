import useMediaQuery from "@/hooks/useMediaQuery";
import SidebarHeader from "./SidebarHeader";
import { cn } from "@sglara/cn";
import { useChatsQuery } from "@/queries/chat/useChatsQuery";
import { useState } from "react";
import SearchContainer from "./search/SearchContainer";
import ChatList from "./ChatList";

/**
 * 聊天界面的側邊欄
 * @returns 包含 Header 與聊天室清單的`aside` JSX 元素
 */
export default function ChatSidebar() {
	const isMobile = useMediaQuery("max", 640);
	const { data } = useChatsQuery();

	const [searchValue, setSearchValue] = useState("");
	const [isSearching, setIsSearching] = useState(false);

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
			<SidebarHeader
				onSearchOpen={(boolean) => setIsSearching(boolean)}
				onSearchChange={(value) => setSearchValue(value)}
				searchValue={searchValue}
			/>
			{isSearching ? (
				<SearchContainer searchValue={searchValue} />
			) : (
				<ChatList chatListData={data} />
			)}
		</aside>
	);
}
