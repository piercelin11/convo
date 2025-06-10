import { chatService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import type {
	ApiResponseSchemaType,
	ChatResponseType,
	CreateGroupChatSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

type CreateGroupContext = {
	prevResponse: ChatResponseType | undefined;
};

export default function useCreateGroup() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatResponseType,
		AxiosError<ApiResponseSchemaType>,
		CreateGroupChatSchemaType,
		CreateGroupContext
	>({
		mutationFn: chatService.createGroupChat,
		onMutate: (newGroup) => {
			queryClient.cancelQueries({ queryKey: chatKeys.all });
			const prevResponse = queryClient.getQueryData(
				chatKeys.all
			) as ChatResponseType;
			queryClient.setQueryData(chatKeys.all, (old: ChatResponseType) => ({
				...old,
				data: [
					...old.data,
					{
						id: Date.now().toString(),
						...newGroup,
					},
				],
			}));

			return { prevResponse };
		},
		onError: (error, _newGroup, context) => {
			if (error instanceof AxiosError)
				console.error("創建聊天室時發生錯誤:", error);
			else console.error("創建聊天室時發生未預期的錯誤:", error);

			if (context) queryClient.setQueryData(chatKeys.all, context.prevResponse);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
