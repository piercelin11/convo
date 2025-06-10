import { useQuery, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import { chatService } from "@/api";
import type { ChatRoomRecord } from "@convo/shared";
import type { AxiosError } from "axios";

export function useChatQuery(roomId: string) {
	const queryClient = useQueryClient();
	return useQuery<ChatRoomRecord, AxiosError>({
		queryKey: chatKeys.detail(roomId),
		queryFn: () => chatService.getChatRoom(roomId),
		enabled: !!roomId,
		initialData: () => {
			const allChatRooms =
				(queryClient.getQueryData(chatKeys.lists()) as ChatRoomRecord[]) ||
				undefined;
			const roomFromCache = allChatRooms?.find((room) => room.id === roomId);
			if (roomFromCache) return roomFromCache;
			return undefined;
		},
	});
}
