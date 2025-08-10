import { useAuth, useSession } from "@/store/auth/useAuth";
import { DropdownItem } from "../ui/DropdownItem";
import useModalContext from "@/store/modal/useModalContext";
import sidebarDropdownMenuItems, {
	type SidebarDropdownMenuItemsType,
} from "@/config/menu/sidebarDropdownMenuItems";
import { useNavigate } from "react-router-dom";
import Avatar from "../ui/Avatar";

const ICON_SIZE = 16;

/**
 * 側邊欄下拉選單中的選單內容。
 * @returns 一個包含多個選單項目的元件。
 */
export default function SidebarMenu() {
	const { logout } = useAuth();
	const { showCustomModal } = useModalContext();
	const navigate = useNavigate();
	const { username, avatar_url } = useSession();

	function handleMenuClick(item: SidebarDropdownMenuItemsType) {
		switch (item.actionType) {
			case "logout": {
				logout();
				break;
			}
			case "modal": {
				if (item.modalContent)
					showCustomModal({
						content: <item.modalContent />,
						title: item.modalTitle,
					});
				else console.error("[SidebarMenu]下拉選單項目缺少 modalKey");
				break;
			}
			case "navigate": {
				if (item.path) navigate(item.path);
				else console.error("[SidebarMenu]下拉選單項目缺少 path");
				break;
			}
		}
	}

	return (
		<>
			<DropdownItem>
				<Avatar size={24} src={avatar_url} />
				<p>{username}</p>
			</DropdownItem>
			<hr />
			{sidebarDropdownMenuItems.map((item) => (
				<DropdownItem key={item.id} onClick={() => handleMenuClick(item)}>
					<div className="mx-1">
						<item.icon size={ICON_SIZE} />
					</div>
					<p>{item.label}</p>
				</DropdownItem>
			))}
		</>
	);
}
