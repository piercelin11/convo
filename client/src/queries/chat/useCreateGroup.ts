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
};

type MutationPayloadType = Omit<CreateGroupChatSchemaType, "img"> & {
	file: File | null;
};

export default function useCreateGroup() {
	const queryClient = useQueryClient();
	return useMutation<
		ChatRoomRecord,
		AxiosError<ApiResponseSchemaType>,
		MutationPayloadType,
		CreateGroupContext
	>({
		mutationFn: async ({ name, members, file }) => {
			let img: string | null = null;
			if (file) {
				const { signedUrl, imageUrl } =
					await uploadService.getChatRoomImgPresignedUrl({
						fileName: file.name,
						contentType: file.type,
					});

				await uploadService.uploadImgToS3(signedUrl, file);
				img = imageUrl;
			}

			const groupData: CreateGroupChatSchemaType = {
				name,
				members,
				img,
			};
			const data = await chatService.createGroupChat(groupData);
			return data;
		},
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

			return { prevGroups };
		},
		onError: (error, _newGroup, context) => {
			if (error instanceof AxiosError)
				console.error("創建聊天室時發生錯誤:", error);
			else console.error("創建聊天室時發生未預期的錯誤:", error);

			if (context)
				queryClient.setQueryData(chatKeys.lists(), context.prevGroups);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
