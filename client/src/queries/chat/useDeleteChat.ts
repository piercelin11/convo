import { chatService } from "@/api";
import type { ApiResponseSchemaType, ChatRoomRecord } from "@convo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import chatKeys from "./chatKeys";

type DeleteChatContext = {
	prevGroups: ChatRoomRecord[] | undefined;
};

export default function useDeleteChat() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatRoomRecord,
		AxiosError<ApiResponseSchemaType>,
		string,
		DeleteChatContext
	>({
		mutationFn: async (roomId: string) => {
			const result = chatService.deleteChatRoom(roomId);
			return result;
		},
		onMutate: (roomId) => {
			queryClient.cancelQueries({ queryKey: chatKeys.lists() });
			const prevGroups = queryClient.getQueryData(
				chatKeys.lists()
			) as ChatRoomRecord[];

			if (prevGroups)
				queryClient.setQueryData(chatKeys.lists(), (old: ChatRoomRecord[]) =>
					old.filter((room) => room.id !== roomId)
				);

			return { prevGroups };
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
		onError: (error, _variables, context) => {
			if (error instanceof AxiosError)
				console.error("刪除聊天室時發生錯誤:", error);
			else console.error("刪除聊天室時發生未預期的錯誤:", error);

			if (context)
				queryClient.setQueryData(chatKeys.lists(), context.prevGroups);
		},
	});
}
