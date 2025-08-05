import { chatService, uploadService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import type {
	ApiResponseSchemaType,
	ChatRoomDto,
	ChatRoomRecord,
	EditChatRoomSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

type CreateGroupContext = {
	prevRooms?: ChatRoomRecord[];
	prevRoom?: ChatRoomRecord;
	uploadedImageUrlForRollback?: string | null;
};

export default function useEditRoomMutation() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatRoomRecord,
		AxiosError<ApiResponseSchemaType>,
		EditChatRoomSchemaType,
		CreateGroupContext
	>({
		mutationFn: chatService.editChatRoom,
		onMutate: async (newRoomData) => {
			await queryClient.cancelQueries({ queryKey: chatKeys.lists() });
			await queryClient.cancelQueries({
				queryKey: chatKeys.detail(newRoomData.id),
			});

			const prevRooms = queryClient.getQueryData(chatKeys.lists()) as
				| ChatRoomDto[]
				| undefined;
			const prevRoom = queryClient.getQueryData(
				chatKeys.detail(newRoomData.id)
			) as ChatRoomRecord | undefined;

			queryClient.setQueryData(chatKeys.lists(), (oldRooms: ChatRoomDto[]) => {
				return oldRooms.map((room) => {
					if (room.id === newRoomData.id) {
						return {
							...room,
							name: newRoomData.name,
							image_url: newRoomData.img,
						};
					}
					return room;
				});
			});
			queryClient.setQueryData(
				chatKeys.detail(newRoomData.id),
				(oldRoom: ChatRoomRecord) => ({
					...oldRoom,
					name: newRoomData.name,
					image_url: newRoomData.img,
				})
			);

			return {
				prevRooms,
				prevRoom,
				uploadedImageUrlForRollback: newRoomData.img,
			};
		},
		onError: (error, _newGroup, context) => {
			if (error instanceof AxiosError)
				console.error("編輯聊天室時發生錯誤:", error);
			else console.error("編輯聊天室時發生未預期的錯誤:", error);

			if (context?.uploadedImageUrlForRollback)
				uploadService.deleteImgFromS3(context.uploadedImageUrlForRollback);

			if (context?.prevRooms)
				queryClient.setQueryData(chatKeys.lists(), context.prevRooms);

			if (context?.prevRoom)
				queryClient.setQueryData(
					chatKeys.detail(context.prevRoom.id),
					context.prevRoom
				);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
