import ComfirmationModalContent from "@/components/ui/ComfirmationModalContent";
import Modal from "@/components/ui/Modal";
import useModalContext from "@/store/modal/useModalContext";

export default function GlobalModal() {
	const { comfirmationOptions, customModalContent, onClose } =
		useModalContext();
	const isOpen = !!(comfirmationOptions || customModalContent);

	return (
		<Modal
			isOpen={isOpen}
			closeHandler={onClose}
			title={comfirmationOptions?.title || customModalContent?.title}
		>
			{comfirmationOptions ? (
				<ComfirmationModalContent options={comfirmationOptions} />
			) : (
				customModalContent?.content
			)}
		</Modal>
	);
}
