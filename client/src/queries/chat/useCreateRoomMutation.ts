import { chatService, uploadService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import type {
	ApiResponseSchemaType,
	ChatRoomRecord,
	CreateChatRoomSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

type CreateGroupContext = {
	prevRooms: ChatRoomRecord[] | undefined;
	uploadedImageUrlForRollback?: string | null;
};

export default function useCreateRoomMutation() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatRoomRecord,
		AxiosError<ApiResponseSchemaType>,
		CreateChatRoomSchemaType,
		CreateGroupContext
	>({
		mutationFn: chatService.createChatRoom,
		onMutate: async (newGroup) => {
			await queryClient.cancelQueries({ queryKey: chatKeys.lists() });

			const prevRooms = queryClient.getQueryData(chatKeys.lists()) as
				| ChatRoomRecord[]
				| undefined;

			queryClient.setQueryData(
				chatKeys.lists(),
				(oldRooms: ChatRoomRecord[]) => [
					...oldRooms,
					{
						id: Date.now().toString(),
						...newGroup,
					},
				]
			);

			return { prevRooms, uploadedImageUrlForRollback: newGroup.img };
		},
		onError: (error, _newGroup, context) => {
			if (error instanceof AxiosError)
				console.error("創建聊天室時發生錯誤:", error);
			else console.error("創建聊天室時發生未預期的錯誤:", error);

			if (context?.uploadedImageUrlForRollback)
				uploadService.deleteImgFromS3(context.uploadedImageUrlForRollback);

			if (context)
				queryClient.setQueryData(chatKeys.lists(), context.prevRooms);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
