import messageKeys from "@/queries/message/messageKeys";
import type { MessageDto } from "@convo/shared";
import type { QueryClient } from "@tanstack/react-query";

export function handleNewMessage(
	queryClient: QueryClient,
	message: MessageDto
) {
	const { room_id } = message;
	queryClient.setQueryData(
		messageKeys.room(room_id),
		(oldData: MessageDto[]) => {
			if (!oldData) return [message];
			return [message, ...oldData];
		}
	);
	queryClient.invalidateQueries({ queryKey: messageKeys.room(room_id) });
}
