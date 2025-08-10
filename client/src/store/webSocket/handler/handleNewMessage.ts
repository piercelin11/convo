import chatKeys from "@/queries/chat/chatKeys";
import messageKeys from "@/queries/message/messageKeys";
import type { MessageDto } from "@convo/shared";
import type { QueryClient } from "@tanstack/react-query";

export function handleNewMessage(
	queryClient: QueryClient,
	currentUserId: string,
	newMessage: MessageDto
) {
	const { room_id, sender_id } = newMessage;
	if (currentUserId !== sender_id)
		queryClient.setQueryData(
			messageKeys.room(room_id),
			(oldData: MessageDto[]) => {
				if (!oldData) return [newMessage];
				return [newMessage, ...oldData];
			}
		);

	queryClient.invalidateQueries({ queryKey: messageKeys.room(room_id) });
	queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
}
