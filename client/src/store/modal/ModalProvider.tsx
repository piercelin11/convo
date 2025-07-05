import { useCallback, useState } from "react";
import ModalContext, {
	type ComfirmationOptionsType,
	type CustomModalContentType,
} from "./ModalContext";
import Modal from "@/components/ui/Modal";
import ComfirmationModalContent from "@/components/ui/ComfirmationModalContent";

/**
 * 控制彈跳視窗的 context provider
 * @returns 控制彈跳視窗的 context provider
 */
export default function ModalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [comfirmationOptions, setComfirmationOptions] =
		useState<ComfirmationOptionsType | null>(null);
	const [customModalContent, setCustomModalContent] =
		useState<CustomModalContentType | null>(null);

	const isOpen = !!(comfirmationOptions || customModalContent);

	const showCustomModal = useCallback((content: CustomModalContentType) => {
		setComfirmationOptions(null);
		setCustomModalContent(content);
	}, []);

	const showComfirmationModal = useCallback(
		(options: ComfirmationOptionsType) => {
			setCustomModalContent(null);
			setComfirmationOptions(options);
		},
		[]
	);

	const onClose = useCallback(() => {
		setComfirmationOptions(null);
		setCustomModalContent(null);
	}, []);
	return (
		<ModalContext.Provider
			value={{
				showComfirmationModal,
				showCustomModal,
				onClose,
			}}
		>
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
			{children}
		</ModalContext.Provider>
	);
}
