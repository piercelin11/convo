import chatRoomDropdownMenuItems, {
	type ChatRoomDropdownMenuItemsType,
} from "@/config/menu/chatRoomDropdownMenuItems";
import { DropdownItem } from "../ui/DropdownItem";
import useDeleteChatMutation from "@/queries/chat/useDeleteChatMutation";
import { useNavigate } from "react-router-dom";
import useModalContext from "@/store/modal/useModalContext";

type ChatRoomMenuProps = {
	roomId: string;
};

export default function ChatRoomMenu({ roomId }: ChatRoomMenuProps) {
	const { mutate } = useDeleteChatMutation();
	const navigate = useNavigate();
	const { setModalKey } = useModalContext();

	function handleMenuClick(item: ChatRoomDropdownMenuItemsType) {
		switch (item.actionType) {
			case "delete": {
				mutate(roomId);
				navigate("/");
				break;
			}
			case "modal": {
				if (item.modalKey) setModalKey(item.modalKey);
				else console.error("[SidebarMenu]下拉選單項目缺少 modalKey");
				break;
			}
		}
	}

	return (
		<>
			{chatRoomDropdownMenuItems.map((item) => (
				<DropdownItem key={item.id} onClick={() => handleMenuClick(item)}>
					<item.icon size={16} />
					{item.label}
				</DropdownItem>
			))}
		</>
	);
}
