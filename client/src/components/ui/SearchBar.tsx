import { Search } from "react-feather";

type SearchBarProps = {
	onSearchOpen: (isSearching: boolean) => void;
	onSearchChange: (value: string) => void;
	searchValue: string;
};

export default function SearchBar({
	onSearchOpen,
	onSearchChange,
	searchValue,
}: SearchBarProps) {
	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onSearchChange(value);
		onSearchOpen(!!value);
	};

	return (
		<div className="relative flex-1">
			<div className="flex w-full items-center gap-2 rounded-full bg-neutral-800 px-3">
				<Search className="text-neutral-500" />
				<input
					type="text"
					placeholder="Search"
					className="h-10 w-full focus:outline-none"
					onChange={changeHandler}
					value={searchValue}
				/>
			</div>
		</div>
	);
}
