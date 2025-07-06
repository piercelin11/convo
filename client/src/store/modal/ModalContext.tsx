import { createContext, type ReactNode } from "react";

/**
 * 顯示再次確認 Modal 的型別
 */
export type ComfirmationOptionsType = {
	title: string;
	message: string | ReactNode;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;
};

/**
 * 顯示客製化 Modal 的型別
 */
export type CustomModalContentType = {
	content: ReactNode;
	title?: string;
};

type ModalContextType = {
	showCustomModal: (content: CustomModalContentType) => void;
	showComfirmationModal: (options: ComfirmationOptionsType) => void;
	comfirmationOptions: ComfirmationOptionsType | null;
	customModalContent: CustomModalContentType | null;
	onClose: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 控制彈跳視窗的 context
 */
export default ModalContext;
