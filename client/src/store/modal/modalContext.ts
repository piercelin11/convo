import { createContext } from "react";

// eslint-disable-next-line jsdoc/require-jsdoc
export type ModalKeyType = "createChatRoom" | null;

type ModalContextType = {
	modalKey: ModalKeyType;
	setModalKey: (key: ModalKeyType) => void;
};

const modalContext = createContext<ModalContextType | undefined>(undefined);

export default modalContext;
