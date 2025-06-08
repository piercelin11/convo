import useMediaQuery from "@/hooks/useMediaQuery";
import ChatRoomItem from "./ChatRoomItem";
import SidebarHeader from "./SidebarHeader";
import { cn } from "@sglara/cn";
import { useEffect, useState } from "react";
import type { ChatRoomRecord } from "@convo/shared";
import { Link } from "react-router-dom";
import { chatService } from "@/api";

/**
 * 聊天界面的側邊欄
 * @returns 包含 Header 與聊天室清單的`aside` JSX 元素
 */
export default function ChatSidebar() {
	const isMobile = useMediaQuery("max", 640);
	const [chatRooms, setChatRooms] = useState<ChatRoomRecord[]>([]);

	useEffect(() => {
		async function fetchChatRooms() {
			try {
				const response = await chatService.getUserChatRooms();
				setChatRooms(response.chatRooms);
			} catch (error) {
				console.error("[ChatSidebar]獲取使用者聊天室時發生錯誤:", error);
			}
		}
		fetchChatRooms();
	}, []);

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
					{chatRooms.map((item) => (
						<Link key={item.id} to={`/${item.id}`}>
							<ChatRoomItem name={item.name!} updateAt={item.updated_at} />
						</Link>
					))}
				</ul>
			</div>
		</aside>
	);
}
