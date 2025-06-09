import { authService } from "@/api";
import type { ApiResponseSchemaType, AuthResponseType } from "@convo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import authKeys from "./authKeys";

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation<AuthResponseType, AxiosError<ApiResponseSchemaType>>({
		mutationFn: authService.logout,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
		onError: (error) => {
			if (error instanceof AxiosError) console.error("登出時發生錯誤:", error);
			else console.error("登出時發生未預期的錯誤:", error);
		},
	});
}
