import SearchResultItem from "./SearchResultItem";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useSearchUsers } from "@/queries/user/useSearchUsers";
import { useState } from "react";
import Tab from "@/components/ui/Tab";

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
		data: searchResults,
		isLoading,
		isError,
	} = useSearchUsers(debouncedSearchValue);

	function renderResults() {
		if (isLoading) return <p>搜尋中⋯⋯</p>;
		if (isError) return <p>搜尋失敗，請稍後再試。</p>;
		if (!searchResults || searchResults.length === 0) return <p>查無結果</p>;

		switch (currentTabId) {
			case "users":
				return searchResults.map((result) => (
					<SearchResultItem
						key={result.id}
						imgUrl={result.avatar_url}
						title={result.username}
					/>
				));
			case "rooms":
				return <p>rooms</p>;
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
