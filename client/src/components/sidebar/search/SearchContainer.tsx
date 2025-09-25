import SearchResultItem from "./SearchResultItem";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useSearchUsers } from "@/queries/user/useSearchUsers";
import { useState } from "react";
import Tab from "@/components/ui/Tab";
import { useSearchRooms } from "@/queries/chat/useSearchRoom";

type SearchContainerProps = {
	searchValue: string;
};

const tabOptions = [
	{ id: "users", label: "使用者" },
	{ id: "rooms", label: "聊天室" },
] as const;

export default function SearchContainer({ searchValue }: SearchContainerProps) {
	const debouncedSearchValue = useDebounceValue(searchValue, 500);
	const [currentTabId, setCurrrentTabId] =
		useState<(typeof tabOptions)[number]["id"]>("users");

	const {
		data: userResults,
		isLoading: isUsersLoading,
		isError: isUsersError,
	} = useSearchUsers(debouncedSearchValue);

	const {
		data: roomResults,
		isLoading: isRoomLoading,
		isError: isRoomError,
	} = useSearchRooms(debouncedSearchValue);

	function renderResults() {
		if (isUsersLoading || isRoomLoading) return <p>搜尋中⋯⋯</p>;
		if (isUsersError || isRoomError) return <p>搜尋失敗，請稍後再試。</p>;
		if (
			!userResults ||
			!roomResults ||
			(userResults.length === 0 && roomResults.length === 0)
		)
			return <p>查無結果</p>;

		switch (currentTabId) {
			case "users":
				return userResults.map((result) => (
					<SearchResultItem
						key={result.id}
						userId={result.id}
						imgUrl={result.avatar_url}
						title={result.username}
						content={result.email}
						friendshipStatus={result.friendship_status}
					/>
				));
			case "rooms":
				return roomResults.map((result) => (
					<SearchResultItem
						key={result.id}
						imgUrl={result.image_url}
						title={result.name}
					/>
				));
			default:
				return null;
		}
	}

	return (
		<section className="space-y-6">
			<Tab
				tabOptions={tabOptions}
				currentTabId={currentTabId}
				onTabChange={setCurrrentTabId}
			/>
			<div>{renderResults()}</div>
		</section>
	);
}
