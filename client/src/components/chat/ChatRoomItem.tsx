import { USER_PLACEHOLDER } from "@/config/constants";

/**
 * 主聊天界面側邊欄的清單元素
 * @returns 回傳一個包含`<img>`和文字資訊的`<li/>`元件
 */
export default function ChatRoomItem() {
	return (
		<li className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-neutral-800">
			<img
				src={USER_PLACEHOLDER}
				width={55}
				height={55}
				className="rounded-full"
			/>
			<div className="flex-1">
				<div className="flex items-center">
					<p>Chat room</p>
					<p className="text-description ml-auto text-xs">May 10</p>
				</div>
				<p className="text-description">latest message</p>
			</div>
		</li>
	);
}
