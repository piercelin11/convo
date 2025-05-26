import Avatar from "@/components/ui/Avatar";
import { USER_PLACEHOLDER } from "@/config/constants";

/**
 * 主聊天界面側邊欄的清單元素
 * @returns 回傳一個包含`<img>`和文字資訊的`<li/>`元素
 */
export default function ChatRoomItem() {
	return (
		<li className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-800">
			<Avatar src={USER_PLACEHOLDER} size={55} />
			<div className="flex-1">
				<div className="flex items-center">
					<p>Chat room</p>
					<p className="text-description me-2 ml-auto text-xs">May 10</p>
				</div>
				<p className="text-description">latest message</p>
			</div>
		</li>
	);
}
