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
	const { showComfirmationModal, showCustomModal, onClose } = useModalContext();

	function handleMenuClick(item: ChatRoomDropdownMenuItemsType) {
		switch (item.actionType) {
			case "delete": {
				//setModalKey("comfirmation");
				showComfirmationModal({
					title: "確認刪除聊天室",
					message: "刪除聊天室後，所有訊息都會消失且無法復原",
					onConfirm: () => {
						mutate(roomId);
						onClose();
						navigate("/");
					},
				});
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
