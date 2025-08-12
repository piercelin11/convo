import { useMutation, useQueryClient } from "@tanstack/react-query";
import userkeys from "./userKeys";
import { userService } from "@/api/user.api";
import type {
	ApiResponseSchemaType,
	EditProfileSchemaType,
	ProfileSchemaType,
} from "@convo/shared";
import { AxiosError } from "axios";

export default function useProfileMutation() {
	const queryClient = useQueryClient();

	return useMutation<
		ProfileSchemaType,
		AxiosError<ApiResponseSchemaType>,
		EditProfileSchemaType
	>({
		mutationFn: userService.editProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userkeys.profile() });
		},
		onError: (error) => {
			if (error instanceof AxiosError)
				console.error("提交表單後伺服器發生錯誤", error);
			else console.error("提交表單後發生未預期的錯誤:", error);
		},
	});
}
