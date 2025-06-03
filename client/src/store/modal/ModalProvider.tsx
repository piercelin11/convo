import { useState } from "react";
import modalContext, { type ModalKeyType } from "./modalContext";

export default function ModalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [modalKey, setModalKey] = useState<ModalKeyType | null>(null);
	return (
		<modalContext.Provider
			value={{ modalKey, setModalKey: (key) => setModalKey(key) }}
		>
			{children}
		</modalContext.Provider>
	);
}
