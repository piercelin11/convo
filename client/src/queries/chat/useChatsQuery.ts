import { useQuery } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import { chatService } from "@/api";

export function useChatsQuery() {
	return useQuery({
		queryKey: chatKeys.lists(),
		queryFn: chatService.getChatRooms,
	});
}
