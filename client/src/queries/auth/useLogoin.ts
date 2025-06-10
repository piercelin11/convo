import { authService } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authKeys from "./authKeys";
import type {
	ApiResponseSchemaType,
	LoginSchemaType,
	UserDTO,
} from "@convo/shared";
import { AxiosError } from "axios";

export default function useLogin() {
	const queryClient = useQueryClient();
	return useMutation<
		UserDTO,
		AxiosError<ApiResponseSchemaType>,
		LoginSchemaType
	>({
		mutationFn: authService.login,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
		onError: (error) => {
			if (error instanceof AxiosError) console.error("登入時發生錯誤:", error);
			else console.error("登入時發生未預期的錯誤:", error);
		},
	});
}
