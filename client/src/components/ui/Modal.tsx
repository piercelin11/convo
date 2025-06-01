import React from "react";
import CloseIcon from "@mui/icons-material/Close";

type ModalProps = {
	closeHandler?: () => void;
	isOpen: boolean;
	children?: React.ReactNode;
};

export default function Modal({ isOpen, closeHandler, children }: ModalProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className={`bg-overlay-100 fixed top-0 z-10 mx-auto h-dvh w-full`}
			onClick={closeHandler}
		>
			<div
				className={`${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} fixed top-0 right-0 z-10 h-dvh w-105 overflow-scroll p-6 transition duration-700 ease-in`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-end">
					<button onClick={closeHandler}>
						<CloseIcon />
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}
