import Avatar from "@/components/ui/Avatar";
import IconBtn from "@/components/ui/IconBtn";
import { USER_PLACEHOLDER } from "@/config/constants";
import { MoreVertical, Search } from "react-feather";

/**
 * 聊天室上方顯示聊天室資訊與其他功能的 Header
 * @returns 一個包含`img`、文字資訊以及搜尋與更多選項按鈕的 JSX 元素
 */
export default function ChatRoomHeader() {
	return (
		<div className="h-header flex items-center justify-between px-4">
			<div className="flex items-center gap-2">
				<Avatar src={USER_PLACEHOLDER} size={40} />
				<p className="text-neutral-300">Chat room</p>
			</div>
			<div className="flex items-center gap-2">
				<IconBtn>
					<Search className="text-neutral-500" />
				</IconBtn>
				<IconBtn>
					<MoreVertical className="text-neutral-500" />
				</IconBtn>
			</div>
		</div>
	);
}
