import ChatRoom from "@/components/chat/ChatRoom";
import ChatSidebar from "@/components/sidebar/ChatSidebar";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function ChatRoomPage() {
	const isMobile = useMediaQuery("max", 640);

	return (
		<div className="flex h-dvh">
			{!isMobile && <ChatSidebar />}
			<ChatRoom />
		</div>
	);
}
