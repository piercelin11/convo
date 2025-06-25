import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import MessageInputArea from "@/components/chat/MessageInputArea";
import MessageContainer from "@/components/chat/MessageContainer";
import { useParams } from "react-router-dom";
import type { ChatPageParams } from "@/types/params";
import NotFound from "./NotFound";
import { useChatQuery } from "@/queries/chat/useChatQuery";

export default function ChatRoomPage() {
	const { roomId } = useParams<ChatPageParams>();
	const { data, isLoading } = useChatQuery(roomId!);

	if (!roomId) return <NotFound />;
	if (isLoading || !data) return <p>載入中...</p>;
	return (
		<section className="flex flex-1 flex-col">
			<ChatRoomHeader data={data} />
			<MessageContainer roomId={roomId} />
			<MessageInputArea />
		</section>
	);
}
