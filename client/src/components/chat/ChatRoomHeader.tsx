import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import IconBtn from "@/components/ui/IconBtn";
import { env } from "@/config/env";
import { ArrowLeft, MoreVertical, Search } from "react-feather";
import { Link } from "react-router-dom";
import ChatRoomMenu from "./ChatRoomMenu";
import type { ChatRoomRecord } from "@convo/shared";

type ChatRoomHeaderProps = {
	data: ChatRoomRecord;
};

/**
 * 聊天室上方顯示聊天室資訊與其他功能的 Header
 * @returns 一個包含`img`、文字資訊以及搜尋與更多選項按鈕的 JSX 元素
 */
export default function ChatRoomHeader({ data }: ChatRoomHeaderProps) {
	return (
		<div className="h-header flex items-center justify-between px-4">
			<div className="flex items-center gap-2">
				<Link to={"/"}>
					<ArrowLeft
						size={20}
						className="text-neutral-500 hover:text-neutral-100 sm:hidden"
					/>
				</Link>
				<Avatar src={env.VITE_USER_IMG_PLACEHOLDER} size={40} />
				<p className="text-neutral-300">{data?.name}</p>
			</div>
			<div className="flex items-center gap-2">
				<IconBtn>
					<Search className="text-neutral-500" />
				</IconBtn>
				<Dropdown
					trigger={
						<IconBtn>
							<MoreVertical className="text-neutral-500" />
						</IconBtn>
					}
					align="right"
				>
					<ChatRoomMenu roomId={data.id} />
				</Dropdown>
			</div>
		</div>
	);
}
