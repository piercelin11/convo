import type { ComfirmationOptionsType } from "@/store/modal/ModalContext";
import Button from "./Button";
import useModalContext from "@/store/modal/useModalContext";

type ComfirmationModalContentProps = { options: ComfirmationOptionsType };

export default function ComfirmationModalContent({
	options,
}: ComfirmationModalContentProps) {
	const { message, cancelText, confirmText, onConfirm, onCancel } = options;
	const { onClose } = useModalContext();
	return (
		<div className="space-y-8">
			<p className="text-neutral-500">{message}</p>
			<div className="bottom-0 left-0 mt-auto flex w-full gap-2 bg-neutral-900">
				<Button
					className="bg-neutral-800 text-neutral-400"
					onClick={() => {
						if (onCancel) onCancel();
						else onClose();
					}}
				>
					{cancelText || "取消"}
				</Button>
				<Button onClick={onConfirm}>{confirmText || "確認"}</Button>
			</div>
		</div>
	);
}
