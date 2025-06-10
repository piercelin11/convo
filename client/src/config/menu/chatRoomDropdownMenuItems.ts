import { Trash } from "react-feather";

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
	actionType: "delete" | "action";
	/**
	 * 選單項目上的圖示。
	 */
	icon: React.ElementType;
	/**
	 * 選單項目上的文字。
	 */
	label: string;
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
] as ChatRoomDropdownMenuItemsType[];

export default chatRoomDropdownMenuItems;
