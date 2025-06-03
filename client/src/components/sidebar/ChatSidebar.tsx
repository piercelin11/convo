import useMediaQuery from "@/hooks/useMediaQuery";
import ChatRoomItem from "./ChatRoomItem";
import SidebarHeader from "./SidebarHeader";
import { cn } from "@sglara/cn";
import { useEffect, useState } from "react";
import { useSession } from "@/store/auth/useAuth";
import { chatRoomsService } from "@/api/api";
import type { ChatRoomRecord } from "@convo/shared";

/**
 * 聊天界面的側邊欄
 * @returns 包含 Header 與聊天室清單的`aside` JSX 元素
 */
export default function ChatSidebar() {
	const isMobile = useMediaQuery("max", 640);
	const [chatRooms, setChatRooms] = useState<ChatRoomRecord[]>([]);
	const user = useSession();

	useEffect(() => {
		async function fetchChatRooms() {
			try {
				const response = await chatRoomsService.getUserChatRooms();
				setChatRooms(response.chatRooms);
			} catch (error) {
				console.error("[ChatSidebar]獲取使用者聊天室時發生錯誤:", error);
			}
		}
		fetchChatRooms();
	}, [user]);

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
						<ChatRoomItem
							key={item.id}
							name={item.name!}
							updateAt={item.updated_at}
						/>
					))}
				</ul>
			</div>
		</aside>
	);
}
