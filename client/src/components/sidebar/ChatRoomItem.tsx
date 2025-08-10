import Avatar from "@/components/ui/Avatar";
import { env } from "@/config/env";
import { format } from "date-fns";

type ChatRoomItemProps = {
	name: string;
	updateAt: Date | null;
	latestMessage: string | null;
	imgUrl: string | null;
};

/**
 * 主聊天界面側邊欄的清單元素
 * @returns 回傳一個包含`<img>`和文字資訊的`<li/>`元素
 */
export default function ChatRoomItem({
	name,
	updateAt,
	latestMessage,
	imgUrl,
}: ChatRoomItemProps) {
	const formatedDate = format(updateAt || Date.now(), "MMM dd");
	return (
		<li className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-800">
			<Avatar src={imgUrl || env.VITE_USER_IMG_PLACEHOLDER} size={55} />
			<div className="flex-1 overflow-hidden">
				<div className="flex items-center">
					<p>{name}</p>
					<p className="text-description me-2 ml-auto text-xs">
						{updateAt ? formatedDate : ""}
					</p>
				</div>
				<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
					{latestMessage || "開始聊天吧！"}
				</p>
			</div>
		</li>
	);
}
