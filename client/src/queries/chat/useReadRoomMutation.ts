import { chatService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatKeys from "./chatKeys";
import type {
	ApiResponseSchemaType,
	ChatRoomDto,
	ReadChatRoomSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

type CreateGroupContext = {
	prevRooms: ChatRoomDto[] | undefined;
};

export default function useReadRoomMutation() {
	const queryClient = useQueryClient();
	return useMutation<
		void,
		AxiosError<ApiResponseSchemaType>,
		ReadChatRoomSchemaType,
		CreateGroupContext
	>({
		mutationFn: chatService.readChatRoom,
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({ queryKey: chatKeys.lists() });

			const prevRooms = queryClient.getQueryData(chatKeys.lists()) as
				| ChatRoomDto[]
				| undefined;

			queryClient.setQueryData(chatKeys.lists(), (oldRooms: ChatRoomDto[]) => {
				return oldRooms.map((room) => {
					if (room.id === id) {
						return {
							...room,
							unread_count: 0,
						};
					}
					return room;
				});
			});

			return { prevRooms };
		},
		onError: (error, _newGroup, context) => {
			if (error instanceof AxiosError)
				console.error("已讀聊天室時發生錯誤:", error);
			else console.error("已讀聊天室時發生未預期的錯誤:", error);

			if (context)
				queryClient.setQueryData(chatKeys.lists(), context.prevRooms);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
	});
}
