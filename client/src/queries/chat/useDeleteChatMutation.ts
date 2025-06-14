import { chatService } from "@/api";
import type { ApiResponseSchemaType, ChatRoomRecord } from "@convo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import chatKeys from "./chatKeys";

type DeleteChatContext = {
	prevRooms: ChatRoomRecord[] | undefined;
};

export default function useDeleteChatMutation() {
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
		onMutate: async (roomId) => {
			await queryClient.cancelQueries({ queryKey: chatKeys.lists() });
			const prevRooms = queryClient.getQueryData(chatKeys.lists()) as
				| ChatRoomRecord[]
				| undefined;

			queryClient.setQueryData(chatKeys.lists(), (oldRooms: ChatRoomRecord[]) =>
				oldRooms.filter((room) => room.id !== roomId)
			);

			return { prevRooms };
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
		onError: (error, _variables, context) => {
			if (error instanceof AxiosError)
				console.error("刪除聊天室時發生錯誤:", error);
			else console.error("刪除聊天室時發生未預期的錯誤:", error);

			if (context)
				queryClient.setQueryData(chatKeys.lists(), context.prevRooms);
		},
	});
}
