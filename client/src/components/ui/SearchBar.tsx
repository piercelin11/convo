import { useSearchUsers } from "@/queries/user/useSearchUsers";
import { useEffect, useState } from "react";
import { Search } from "react-feather";

export default function SearchBar() {
	// 1. 即時追蹤輸入框的值，用於 UI 顯示
	const [inputValue, setInputValue] = useState("");
	// 2. 延遲更新的搜尋關鍵字，用於觸發 API 請求
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	// 追蹤下拉式選單是否開啟
	const [isOpen, setIsOpen] = useState(false);

	// 使用 useEffect 實現Debounce
	useEffect(() => {
		// 設定一個 500ms 的計時器
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(inputValue);
		}, 500);

		// 清理函式：在 inputValue 改變時，清除舊的計時器
		return () => {
			clearTimeout(handler);
		};
	}, [inputValue]);

	// 3. 使用 React Query Hook 處理 API 請求
	// Hook 監聽的是延遲更新的狀態
	const {
		data: searchResults,
		isLoading,
		error,
	} = useSearchUsers(debouncedSearchTerm);

	useEffect(() => {
		console.log("當前的搜尋結果:", searchResults);
		console.log(error);
	}, [searchResults, error]);

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		setIsOpen(!!value);
	};

	// 處理點擊結果的函式
	const handleResultClick = (userId: string) => {
		console.log(`Maps to user: ${userId}`);
		setIsOpen(false);
	};

	return (
		<div className="relative flex-1">
			<div className="flex w-full items-center gap-2 rounded-full bg-neutral-800 px-3 py-2">
				<Search className="text-neutral-500" />
				<input
					type="text"
					placeholder="Search"
					className="w-full focus:outline-none"
					onChange={changeHandler}
					value={inputValue}
				/>
			</div>
			{isOpen && (
				<div className="absolute top-full w-full bg-white text-black">
					{/* 狀態 1: 正在載入中 */}
					{isLoading && debouncedSearchTerm && (
						<div className="p-2 text-center text-neutral-500">搜尋中...</div>
					)}
					{/* 狀態 2: 搜尋完成且有結果 */}
					{!isLoading && searchResults && searchResults.length > 0 && (
						<ul className="py-1">
							{searchResults.map((user) => (
								<li
									key={user.id}
									className="flex cursor-pointer items-center p-2 hover:bg-neutral-700"
									onMouseDown={() => handleResultClick(user.id)}
								>
									<img
										className="mr-5 aspect-square h-fit w-10 rounded-full object-cover"
										alt=""
										src={user.avatar_url || "user-placeholder.webp"}
									/>
									{user.username}
								</li>
							))}
						</ul>
					)}
					{/* 狀態 3: 搜尋完成但無結果 */}
					{!isLoading && searchResults && searchResults.length === 0 && (
						<div className="p-2 text-center text-neutral-500">無符合結果</div>
					)}
				</div>
			)}
		</div>
	);
}
