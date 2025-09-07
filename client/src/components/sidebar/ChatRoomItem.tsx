import Avatar from "@/components/ui/Avatar";
import { env } from "@/config/env";
import type { ChatRoomDto } from "@convo/shared";
import { format } from "date-fns";

type ChatRoomItemProps = {
	roomData: ChatRoomDto;
};

/**
 * 主聊天界面側邊欄的清單元素
 * @returns 回傳一個包含`<img>`和文字資訊的`<li/>`元素
 */
export default function ChatRoomItem({ roomData }: ChatRoomItemProps) {
	const {
		latest_message_at,
		name,
		image_url,
		latest_message_content,
		unread_count,
	} = roomData;
	const formatedDate = format(latest_message_at || Date.now(), "MMM dd");
	return (
		<li className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-800">
			<Avatar src={image_url || env.VITE_USER_IMG_PLACEHOLDER} size={55} />
			<div className="flex-1 overflow-hidden pr-2">
				<div className="flex items-center">
					<p>{name}</p>
					<p className="text-description ml-auto text-xs">
						{latest_message_at ? formatedDate : ""}
					</p>
				</div>
				<div className="flex gap-4">
					<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
						{latest_message_content || "開始聊天吧！"}
					</p>
					{!!unread_count && (
						<p className="bg-primary-700 ml-auto min-w-7 rounded-full p-1 text-center text-sm">
							{unread_count}
						</p>
					)}
				</div>
			</div>
		</li>
	);
}
