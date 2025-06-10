import chatRoomDropdownMenuItems, {
	type ChatRoomDropdownMenuItemsType,
} from "@/config/menu/chatRoomDropdownMenuItems";
import { DropdownItem } from "../ui/DropdownItem";
import useDeleteChat from "@/queries/chat/useDeleteChat";
import { useNavigate } from "react-router-dom";

type ChatRoomMenuProps = {
	roomId: string;
};

export default function ChatRoomMenu({ roomId }: ChatRoomMenuProps) {
	const { mutate } = useDeleteChat();
	const navigate = useNavigate();

	function handleMenuClick(item: ChatRoomDropdownMenuItemsType) {
		switch (item.actionType) {
			case "delete": {
				mutate(roomId);
				navigate("/");
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
