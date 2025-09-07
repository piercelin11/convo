/**
 * React Query Hook for searching users by username.
 * @param searchTerm 搜尋關鍵字
 */

import { useQuery } from "@tanstack/react-query";
import userkeys from "./userKeys";
import { userService } from "@/api/user.api";

export function useSearchUsers(searchTerm: string) {
	return useQuery({
		queryKey: userkeys.search(searchTerm),
		queryFn: () => userService.searchUser(searchTerm),
		enabled: !!searchTerm,
	});
}
