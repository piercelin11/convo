import { useQuery, useQueryClient } from "@tanstack/react-query";
import userkeys from "./userKeys";
import { userService } from "@/api/user.api";
import type { ProfileSchemaType } from "@convo/shared";

export default function useProfileQuery(userId: string) {
	const queryClient = useQueryClient();
	return useQuery({
		queryKey: userkeys.profile(),
		queryFn: () => userService.getUser(userId),
		enabled: !!userId,
		initialData: () => {
			const cachedUser =
				(queryClient.getQueryData(userkeys.profile()) as ProfileSchemaType) ||
				undefined;

			if (cachedUser?.id === userId) {
				return cachedUser;
			}
			return undefined;
		},
	});
}
