import messageKeys from "@/queries/message/messageKeys";
import type { QueryClient } from "@tanstack/react-query";

export function handleReadRoom(queryClient: QueryClient, roomId: string) {
	queryClient.invalidateQueries({ queryKey: messageKeys.room(roomId) });
}
