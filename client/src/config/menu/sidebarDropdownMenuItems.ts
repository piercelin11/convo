import { LogOut, MessageSquare } from "react-feather";
import useModalContext from "@/store/modal/useModalContext";
import ModalProvider from "@/store/modal/ModalProvider";
import type { ModalKeyType } from "@/store/modal/ModalContext";

/**
 * 側邊欄下拉選單的項目型別。
 */
export type SidebarDropdownMenuItemsType = {
	/**
	 * 選單項目的 id。需為獨一無二的。
	 */
	id: string;
	/**
	 * 點擊選單項目時的行為種類。分為登出、呼叫彈跳視窗、導向其他路由。
	 */
	actionType: "logout" | "modal" | "navigate";
	/**
	 * 選單項目上的圖示。
	 */
	icon: React.ElementType;
	/**
	 * 選單項目上的文字。
	 */
	label: string;
	/**
	 * 點擊後會導覽向的路徑。
	 */
	path?: string;
	/**
	 * 控制哪個選單開啟的 key。由 {@link useModalContext} 和 {@link ModalProvider} 控制。
	 */
	modalKey?: ModalKeyType;
};

/**
 * 側邊欄下拉選單的項目資料。
 */
const sidebarDropdownMenuItems: SidebarDropdownMenuItemsType[] = [
	{
		id: "logout",
		actionType: "logout",
		icon: LogOut,
		label: "登出",
	},
	{
		id: "creat=chat-room",
		actionType: "modal",
		icon: MessageSquare,
		label: "建立群組",
		modalKey: "createChatRoom",
	},
	{
		id: "profile-edit",
		actionType: "modal",
		icon: MessageSquare,
		label: "修改個人資料",
		modalKey: "profileEdit",
	},
];

export default sidebarDropdownMenuItems;
