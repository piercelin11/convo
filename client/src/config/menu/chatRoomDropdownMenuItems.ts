import type { ModalKeyType } from "@/store/modal/ModalContext";
import { Edit2, Trash } from "react-feather";
import useModalContext from "@/store/modal/useModalContext";
import ModalProvider from "@/store/modal/ModalProvider";

/**
 * 聊天室下拉選單的項目型別。
 */
export type ChatRoomDropdownMenuItemsType = {
	/**
	 * 選單項目的 id。需為獨一無二的。
	 */
	id: string;
	/**
	 * 點擊選單項目時的行為種類。。
	 */
	actionType: "delete" | "action" | "modal";
	/**
	 * 選單項目上的圖示。
	 */
	icon: React.ElementType;
	/**
	 * 選單項目上的文字。
	 */
	label: string;
	/**
	 * 控制哪個選單開啟的 key。由 {@link useModalContext} 和 {@link ModalProvider} 控制。
	 */
	modalKey?: ModalKeyType;
};

/**
 * 獲取聊天室下拉選單的項目資料。
 * @param roomId - 聊天室 id。
 * @returns 聊天室下拉選單的項目資料。
 */
const chatRoomDropdownMenuItems = [
	{
		id: "delete-room",
		actionType: "delete",
		icon: Trash,
		label: "刪除聊天室",
	},
	{
		id: "edit-room",
		actionType: "modal",
		icon: Edit2,
		label: "編輯聊天室",
		modalKey: "editChatRoom",
	},
] as ChatRoomDropdownMenuItemsType[];

export default chatRoomDropdownMenuItems;
