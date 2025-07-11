import { authService } from "@/api";
import type {
	ApiResponseSchemaType,
	RegisterSchemaType,
	UserDTO,
} from "@convo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import authKeys from "./authKeys";

export function useRegisterMutation() {
	const queryClient = useQueryClient();
	return useMutation<
		UserDTO,
		AxiosError<ApiResponseSchemaType>,
		RegisterSchemaType
	>({
		mutationFn: authService.register,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
		onError: (error) => {
			if (error instanceof AxiosError) console.error("註冊時發生錯誤:", error);
			else console.error("註冊時發生未預期的錯誤:", error);
		},
	});
}
