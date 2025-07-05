import { useCallback, useState } from "react";
import ModalContext, {
	type ComfirmationOptionsType,
	type ModalKeyType,
} from "./ModalContext";

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
	const [comfirmationOptions, setComfirmationOptions] =
		useState<ComfirmationOptionsType | null>(null);

	const setModalKeyMemo = useCallback((key: ModalKeyType) => {
		setModalKey(key);
	}, []);

	const setComfirmationOptionsMemo = useCallback(
		(options: ComfirmationOptionsType | null) => {
			setComfirmationOptions(options);
		},
		[]
	);

	const onClose = useCallback(() => {
		setModalKey(null);
		setComfirmationOptions(null);
	}, []);
	return (
		<ModalContext.Provider
			value={{
				modalKey,
				setModalKey: setModalKeyMemo,
				setComfirmationOptions: setComfirmationOptionsMemo,
				comfirmationOptions,
				onClose,
			}}
		>
			{children}
		</ModalContext.Provider>
	);
}
