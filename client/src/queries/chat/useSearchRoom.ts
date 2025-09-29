/**
 * React Query Hook for searching chat rooms by content.
 * @param searchTerm The search term.
 */
import { useQuery } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import { chatService } from "@/api/chat.api";

export function useSearchRooms(searchTerm: string) {
	return useQuery({
		queryKey: chatKeys.search(searchTerm),
		queryFn: () => chatService.searchChatRooms(searchTerm),
		enabled: !!searchTerm,
	});
}
