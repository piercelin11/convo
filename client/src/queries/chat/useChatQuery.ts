import { useQuery } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import { chatService } from "@/api";

export function useChatQuery() {
	return useQuery({
		queryKey: chatKeys.all,
		queryFn: chatService.getUserChatRooms,
	});
}
