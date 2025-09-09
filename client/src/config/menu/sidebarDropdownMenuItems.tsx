import { Bell, LogOut, MessageSquare, PenTool } from "react-feather";
import CreateGroupChatForm from "@/components/chat/CreateGroupChat/CreateGroupChatForm";
import ProfileModal from "@/components/profile/ProfileModal";
import NotificationModal from "@/components/notification/NotificationModal";

/**
 * 側邊欄下拉選單的項目型別。
 */
export type SidebarDropdownMenuItemsType = {
	/**
	 * 選單項目的 id。需為獨一無二的。
	 */
	id: string;
	/**
	 * 點擊選單項目時的行為種類。分為登出、呼叫彈跳視窗、導向其他路由以及使用者資訊。
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
	 * 彈跳視窗中的內容。
	 */
	modalContent?: React.ComponentType;
	/**
	 * 彈跳視窗中的標題。
	 */
	modalTitle?: string;
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
		modalContent: CreateGroupChatForm,
		modalTitle: "建立群組",
	},
	{
		id: "profile-edit",
		actionType: "modal",
		icon: PenTool,
		label: "修改個人資料",
		modalContent: ProfileModal,
		modalTitle: "修改個人資料",
	},
	{
		id: "notification",
		actionType: "modal",
		icon: Bell,
		label: "通知",
		modalContent: NotificationModal,
		modalTitle: "通知",
	},
];

export default sidebarDropdownMenuItems;
