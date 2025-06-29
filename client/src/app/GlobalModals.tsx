import CreateGroupChatForm from "@/components/chat/CreateGroupChat/CreateGroupChatForm";
import EditChatRoomForm from "@/components/chat/EditGroupChat/EditChatRoomForm";
import ProfileModal from "@/components/profile/ProfileModal";
import Modal from "@/components/ui/Modal";
import useModalContext from "@/store/modal/useModalContext";

export default function GlobalModals() {
	const { modalKey, setModalKey } = useModalContext();

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
			default: {
				return;
			}
		}
	}

	return (
		<Modal
			isOpen={!!modalKey}
			closeHandler={() => setModalKey(null)}
			{...getModalContent()}
		/>
	);
}
