import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import MessageInputArea from "@/components/chat/MessageInputArea";
import MessageContainer from "@/components/chat/MessageContainer";

/**
 * 包含聊天訊息與輸入框的聊天室的區塊
 * @returns 一個包含 {@link ChatRoomHeader}、{@link MessageInputArea}、{@link MessageContainer} 的 `section` 元素
 */
export default function ChatRoom() {
	return (
		<section className="flex flex-1 flex-col">
			<ChatRoomHeader />
			<MessageContainer />
			<MessageInputArea />
		</section>
	);
}
