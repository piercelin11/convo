import Button from "@/components/ui/Button";
import SearchResultItem from "./SearchResultItem";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useSearchUsers } from "@/queries/user/useSearchUsers";
import { useState } from "react";
import { cn } from "@sglara/cn";

type SearchContainerProps = {
	searchValue: string;
};

type TabOptions = "users" | "rooms";

export default function SearchContainer({ searchValue }: SearchContainerProps) {
	const debouncedSearchValue = useDebounceValue(searchValue, 500);
	const [currentTab, setCurrrentTab] = useState<TabOptions>("users");

	const {
		data: searchResults,
		isLoading,
		isError,
	} = useSearchUsers(debouncedSearchValue);

	function renderResults() {
		if (isLoading) return <p>搜尋中⋯⋯</p>;
		if (isError) return <p>搜尋失敗，請稍後再試。</p>;
		if (!searchResults || searchResults.length === 0) return <p>查無結果</p>;

		switch (currentTab) {
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
			<div className="flex gap-2">
				<Button
					className={cn(
						"rounded-t-xl rounded-b-none bg-transparent px-2 py-2 text-neutral-400 hover:bg-neutral-800",
						{
							"text-primary-600 border-primary-500 border-b-1":
								currentTab === "users",
						}
					)}
					onClick={() => setCurrrentTab("users")}
				>
					使用者
				</Button>
				<Button
					className={cn(
						"rounded-t-xl rounded-b-none bg-transparent px-2 py-2 text-neutral-400 hover:bg-neutral-800",
						{
							"text-primary-600 border-primary-500 border-b-1":
								currentTab === "rooms",
						}
					)}
					onClick={() => setCurrrentTab("rooms")}
				>
					聊天室
				</Button>
			</div>
			<div>{renderResults()}</div>
		</section>
	);
}
