import Dropdown from "@/components/ui/Dropdown";
import { DropdownItem } from "@/components/ui/DropdownItem";
import IconBtn from "@/components/ui/IconBtn";
import { useAuth } from "@/store/auth/useAuth";
import { LogOut, Menu, Search } from "react-feather";

const ICON_SIZE = 16;

/**
 * 聊天室介面側邊欄最上方的 Header
 * @returns 一個包含選單按鈕與搜尋用`input`的 JSX 元素
 */
export default function SidebarHeader() {
	const { logout } = useAuth();
	const menuOptions = [
		{
			id: "logout-button",
			content: (
				<>
					<LogOut size={ICON_SIZE} />
					<p>Log Out</p>
				</>
			),
			onClick: () => logout(),
		},
	];

	return (
		<div className="h-header flex items-center gap-2 px-4 py-2">
			<Dropdown
				trigger={
					<IconBtn>
						<Menu className="text-neutral-500" />
					</IconBtn>
				}
			>
				{menuOptions.map((option) => (
					<DropdownItem key={option.id} onClick={option.onClick}>
						{option.content}
					</DropdownItem>
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
