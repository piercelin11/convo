import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import MessageInputArea from "@/components/chat/MessageInputArea";
import MessageContainer from "@/components/chat/MessageContainer";
import { useParams } from "react-router-dom";
import type { ChatPageParams } from "@/types/params";
import NotFound from "./NotFound";
import { useChatQuery } from "@/queries/chat/useChatQuery";
import { useEffect } from "react";
import { useAuth, useSession } from "@/store/auth/useAuth";
import useWebSocketContext from "@/store/webSocket/useWebSocketContext";
import type { ChatRoomDto, InboundMessageSchemaType } from "@convo/shared";
import { useQueryClient } from "@tanstack/react-query";
import chatKeys from "@/queries/chat/chatKeys";

export default function ChatRoomPage() {
	const { roomId } = useParams<ChatPageParams>();
	const { data, isLoading, error } = useChatQuery(roomId!);
	const { id: userId } = useSession();
	const { readyState, sendMessage } = useWebSocketContext();
	const { user } = useAuth();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!roomId || !user) return;
		const JoinRoomMessage: InboundMessageSchemaType = {
			type: "JOIN_ROOM",
			payload: {
				roomId,
				userId,
			},
		};
		if (readyState === "OPEN") {
			queryClient.setQueryData<ChatRoomDto[]>(
				chatKeys.lists(),
				(oldRoomsList) => {
					if (!oldRoomsList) return [];
					return oldRoomsList.map((room) =>
						room.id === roomId ? { ...room, unread_count: 0 } : room
					);
				}
			);
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
	}, [queryClient, readyState, roomId, sendMessage, user, userId]);

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
