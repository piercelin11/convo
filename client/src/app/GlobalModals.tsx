import CreateGroupChatForm from "@/components/chat/form/CreateGroupChatForm";
import Modal from "@/components/ui/Modal";
import useModalContext from "@/store/modal/useModalContext";

export default function GlobalModals() {
	const { modalKey, setModalKey } = useModalContext();

	if (!modalKey) return;

	function getModalContent() {
		switch (modalKey) {
			case "createChatRoom": {
				return <CreateGroupChatForm />;
			}
			default: {
				return <p>default</p>;
			}
		}
	}

	return (
		<Modal isOpen={!!modalKey} closeHandler={() => setModalKey(null)}>
			{getModalContent()}
		</Modal>
	);
}
