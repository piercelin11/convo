import CreateGroupChatForm from "@/components/chat/CreateGroupChat/CreateGroupChatForm";
import EditChatRoomForm from "@/components/chat/EditGroupChat/EditChatRoomForm";
import ProfileModal from "@/components/profile/ProfileModal";
import ComfirmationModal from "@/components/ui/ComfirmationModal";
import Modal from "@/components/ui/Modal";
import useModalContext from "@/store/modal/useModalContext";

export default function GlobalModals() {
	const { modalKey, comfirmationOptions, onClose } = useModalContext();

	if (!modalKey) return;

	function getModalContent() {
		switch (modalKey) {
			case "createChatRoom": {
				return { children: <CreateGroupChatForm />, title: "創建聊天室" };
			}
			case "editChatRoom": {
				return { children: <EditChatRoomForm />, title: "編輯聊天室" };
			}
			case "profileEdit": {
				return { children: <ProfileModal />, title: "編輯個人資料" };
			}
			case "comfirmation": {
				if (!comfirmationOptions) {
					console.error("再次確認動作的彈跳視窗缺少視窗內容");
					return;
				}

				return {
					children: <ComfirmationModal options={comfirmationOptions} />,
					title: comfirmationOptions.title,
				};
			}
			default: {
				return;
			}
		}
	}

	return (
		<Modal isOpen={!!modalKey} closeHandler={onClose} {...getModalContent()} />
	);
}
