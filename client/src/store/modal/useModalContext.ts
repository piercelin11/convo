import { useContext } from "react";
import modalContext from "./modalContext";

export default function useModalContext() {
	const context = useContext(modalContext);
	if (!context) {
		throw new Error("[useModalContext]必須於 Provider 包裹的元件內使用");
	}

	return context;
}
