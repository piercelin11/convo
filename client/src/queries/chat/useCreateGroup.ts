import { chatService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import type {
	ApiResponseSchemaType,
	ChatResponseType,
	CreateGroupChatSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

export default function useCreateGroup() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatResponseType,
		AxiosError<ApiResponseSchemaType>,
		CreateGroupChatSchemaType
	>({
		mutationFn: chatService.createGroupChat,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
		onError: (error) => {
			if (error instanceof AxiosError)
				console.error("創建聊天室時發生錯誤:", error);
			else console.error("創建聊天室時發生未預期的錯誤:", error);
		},
	});
}
