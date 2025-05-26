import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import MessageInputArea from "@/components/chat/MessageInputArea";
import MessageContainer from "@/components/chat/MessageContainer";

export default function ChatRoom() {
	return (
		<section className="flex flex-1 flex-col">
			<ChatRoomHeader />
			<MessageContainer />
			<MessageInputArea />
		</section>
	);
}
