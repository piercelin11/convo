import { useState } from "react";
import ModalContext, { type ModalKeyType } from "./ModalContext";

/**
 * 控制彈跳視窗的 context provider
 * @returns 控制彈跳視窗的 context provider
 */
export default function ModalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [modalKey, setModalKey] = useState<ModalKeyType | null>(null);
	return (
		<ModalContext.Provider
			value={{ modalKey, setModalKey: (key) => setModalKey(key) }}
		>
			{children}
		</ModalContext.Provider>
	);
}
