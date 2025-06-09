import { useQuery } from "@tanstack/react-query";
import friendshipKeys from "./friendshipKeys";
import { friendshipService } from "@/api";

export function useFriendshipQuery() {
	return useQuery({
		queryKey: friendshipKeys.all,
		queryFn: friendshipService.getUserFriends,
	});
}
