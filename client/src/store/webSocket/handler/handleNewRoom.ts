import chatKeys from "@/queries/chat/chatKeys";
import type { QueryClient } from "@tanstack/react-query";

export function handleNewRoom(queryClient: QueryClient) {
	queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
}
