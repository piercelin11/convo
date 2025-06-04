import { useContext } from "react";
import ModalContext from "./ModalContext";

/**
 * 為 {@link ModalContext} 客製化的 useContext
 * @returns 為 {@link ModalContext} 客製化的 useContext
 */
export default function useModalContext() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("[useModalContext]必須於 Provider 包裹的元件內使用");
	}

	return context;
}
