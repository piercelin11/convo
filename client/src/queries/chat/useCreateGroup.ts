import { chatService, uploadService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import type {
	ApiResponseSchemaType,
	ChatRoomRecord,
	CreateGroupChatSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

type CreateGroupContext = {
	prevGroups: ChatRoomRecord[] | undefined;
	uploadedImageUrlForRollback?: string | null;
};

export default function useCreateGroup() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatRoomRecord,
		AxiosError<ApiResponseSchemaType>,
		CreateGroupChatSchemaType,
		CreateGroupContext
	>({
		mutationFn: chatService.createGroupChat,
		onMutate: (newGroup) => {
			queryClient.cancelQueries({ queryKey: chatKeys.lists() });
			const prevGroups = queryClient.getQueryData(
				chatKeys.lists()
			) as ChatRoomRecord[];
			queryClient.setQueryData(chatKeys.lists(), (old: ChatRoomRecord[]) => [
				...old,
				{
					id: Date.now().toString(),
					...newGroup,
				},
			]);

			return { prevGroups, uploadedImageUrlForRollback: newGroup.img };
		},
		onError: (error, _newGroup, context) => {
			if (error instanceof AxiosError)
				console.error("創建聊天室時發生錯誤:", error);
			else console.error("創建聊天室時發生未預期的錯誤:", error);

			if (context?.uploadedImageUrlForRollback)
				uploadService.deleteImgFromS3(context.uploadedImageUrlForRollback);

			if (context)
				queryClient.setQueryData(chatKeys.lists(), context.prevGroups);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
