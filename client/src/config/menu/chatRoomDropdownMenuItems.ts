import { Edit2, Trash } from "react-feather";
import EditChatRoomForm from "@/components/chat/EditGroupChat/EditChatRoomForm";

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
	 * 彈跳視窗中的內容。
	 */
	modalContent?: React.ComponentType;
	/**
	 * 彈跳視窗中的標題。
	 */
	modalTitle?: string;
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
		modalContent: EditChatRoomForm,
		modalTitle: "編輯聊天室",
	},
] as ChatRoomDropdownMenuItemsType[];

export default chatRoomDropdownMenuItems;
