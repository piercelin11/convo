import { createContext, type ReactNode } from "react";

// eslint-disable-next-line jsdoc/require-jsdoc
export type ModalKeyType =
	| "createChatRoom"
	| "profileEdit"
	| "editChatRoom"
	| "comfirmation"
	| null;

// eslint-disable-next-line jsdoc/require-jsdoc
export type ComfirmationOptionsType = {
	title: string;
	message: string | ReactNode;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;
};

type ModalContextType = {
	modalKey: ModalKeyType;
	setModalKey: (key: ModalKeyType) => void;
	setComfirmationOptions: (options: ComfirmationOptionsType | null) => void;
	comfirmationOptions: ComfirmationOptionsType | null;
	onClose: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 控制彈跳視窗的 context
 */
export default ModalContext;
