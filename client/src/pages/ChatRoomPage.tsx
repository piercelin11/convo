import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import MessageInputArea from "@/components/chat/MessageInputArea";
import MessageContainer from "@/components/chat/MessageContainer";
import { useParams } from "react-router-dom";
import type { ChatPageParams } from "@/types/params";
import NotFound from "./NotFound";
import { useChatQuery } from "@/queries/chat/useChatQuery";
import { useEffect } from "react";
import { useSession } from "@/store/auth/useAuth";
import useWebSocketContext from "@/store/webSocket/useWebSocketContext";
import type { InboundMessageSchemaType } from "@convo/shared";

export default function ChatRoomPage() {
	const { roomId } = useParams<ChatPageParams>();
	const { id: userId } = useSession();
	const { readyState, sendMessage } = useWebSocketContext();
	const { data, isLoading, error } = useChatQuery(roomId!);

	useEffect(() => {
		if (!roomId) return;
		const JoinRoomMessage: InboundMessageSchemaType = {
			type: "JOIN_ROOM",
			payload: {
				roomId,
				userId,
			},
		};
		if (readyState === "OPEN") {
			sendMessage(JSON.stringify(JoinRoomMessage));
		} else console.warn("WebSocket 尚未連線");

		return () => {
			const LeaveRoomMessage: InboundMessageSchemaType = {
				type: "LEAVE_ROOM",
				payload: {
					userId,
				},
			};
			if (readyState === "OPEN") {
				sendMessage(JSON.stringify(LeaveRoomMessage));
			} else console.warn("WebSocket 尚未連線");
		};
	}, [readyState, roomId, sendMessage, userId]);

	if (isLoading && !error) return <p>載入中...</p>;
	if (!roomId || !data) return <NotFound />;

	return (
		<section className="flex flex-1 flex-col">
			<ChatRoomHeader data={data} />
			<MessageContainer roomId={roomId} />
			<MessageInputArea roomId={roomId} />
		</section>
	);
}
