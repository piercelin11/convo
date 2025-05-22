import ChatRoomHeader from "@/components/chat/messageArea/ChatRoomHeader";
import MessageInputArea from "@/components/chat/messageArea/MessageInputArea";
import MessageList from "@/components/chat/messageArea/MessageList";
import ChatSidebar from "@/components/chat/sidebar/ChatSidebar";

export default function ChatPage() {
	return (
		<div className="flex h-dvh">
			<ChatSidebar />
			<section className="flex flex-1 flex-col">
				<ChatRoomHeader />
				<MessageList />
				<MessageInputArea />
			</section>
		</div>
	);
}
