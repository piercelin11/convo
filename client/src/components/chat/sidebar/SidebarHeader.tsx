import Dropdown from "@/components/ui/Dropdown";
import { DropdownItem } from "@/components/ui/DropdownItem";
import IconBtn from "@/components/ui/IconBtn";
import { Menu, Search } from "react-feather";

/**
 * 聊天室介面側邊欄最上方的 Header
 * @returns 一個包含選單按鈕與搜尋用`input`的 JSX 元素
 */
export default function SidebarHeader() {
	const array = Array.from({ length: 5 }, (_, index) => index);
	return (
		<div className="h-header flex items-center gap-2 px-4 py-2">
			<Dropdown
				trigger={
					<IconBtn>
						<Menu className="text-neutral-500" />
					</IconBtn>
				}
			>
				{array.map((item) => (
					<DropdownItem key={item}>{item}</DropdownItem>
				))}
			</Dropdown>
			<div className="flex flex-1 items-center gap-2 rounded-full bg-neutral-800 px-3 py-2">
				<Search className="text-neutral-500" />
				<input
					type="text"
					placeholder="Search"
					className="w-full focus:outline-none"
				/>
			</div>
		</div>
	);
}
