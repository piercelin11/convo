import { chatService } from "@/api";
import type { ApiResponseSchemaType, ChatRoomRecord } from "@convo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import chatKeys from "./chatKeys";

export default function useDeleteChat() {
	const queryClient = useQueryClient();
	return useMutation<ChatRoomRecord, AxiosError<ApiResponseSchemaType>, string>(
		{
			mutationFn: chatService.deleteChatRoom,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
			},
			onError: (error) => {
				if (error instanceof AxiosError)
					console.error("刪除聊天室時發生錯誤:", error);
				else console.error("刪除聊天室時發生未預期的錯誤:", error);
			},
		}
	);
}
