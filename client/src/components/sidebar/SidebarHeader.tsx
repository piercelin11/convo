import Dropdown from "@/components/ui/Dropdown";
import IconBtn from "@/components/ui/IconBtn";
import { Menu } from "react-feather";
import SidebarMenu from "./SidebarMenu";
import SearchBar from "../ui/SearchBar";

/**
 * 聊天室介面側邊欄最上方的 Header
 * @returns 一個包含選單按鈕與搜尋用`input`的 JSX 元素
 */
export default function SidebarHeader() {
	return (
		<div className="h-header flex items-center gap-2 px-4 py-2">
			<Dropdown
				trigger={
					<IconBtn>
						<Menu className="text-neutral-500" />
					</IconBtn>
				}
			>
				<SidebarMenu />
			</Dropdown>
			<div className="w-full">
				<SearchBar />
			</div>
		</div>
	);
}
