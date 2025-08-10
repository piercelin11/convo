import { useQuery } from "@tanstack/react-query";
import messageKeys from "./messageKeys";
import { messageService } from "@/api/message.api";

export default function useMessageQuery(roomId: string) {
	return useQuery({
		queryKey: messageKeys.room(roomId),
		queryFn: () => messageService.getMessagesByRoomId(roomId),
	});
}
