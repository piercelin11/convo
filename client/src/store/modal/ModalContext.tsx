import { createContext } from "react";

// eslint-disable-next-line jsdoc/require-jsdoc
export type ModalKeyType = "createChatRoom" | "editChatRoom" | null;

type ModalContextType = {
	modalKey: ModalKeyType;
	setModalKey: (key: ModalKeyType) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 控制彈跳視窗的 context
 */
export default ModalContext;
