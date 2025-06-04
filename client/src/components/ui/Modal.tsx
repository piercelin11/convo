import { cn } from "@sglara/cn";
import React from "react";
import { X } from "react-feather";

type ModalProps = {
	closeHandler?: () => void;
	isOpen: boolean;
	children?: React.ReactNode;
	className?: React.ComponentProps<"div">["className"];
};

export default function Modal({
	isOpen,
	closeHandler,
	children,
	className,
}: ModalProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className={"fixed top-0 z-50 mx-auto flex h-dvh w-full bg-neutral-950/70"}
			onClick={closeHandler}
		>
			<div
				className={cn(
					"relative m-auto max-h-1/2 min-w-105 overflow-y-scroll overscroll-contain rounded-xl border border-neutral-800 bg-neutral-900 p-6",
					className
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-100"
					onClick={closeHandler}
				>
					<X size={16} />
				</button>
				{children}
			</div>
		</div>
	);
}
