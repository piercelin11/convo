import { cn } from "@sglara/cn";
import React from "react";
import { X } from "react-feather";

type ModalProps = {
	closeHandler?: () => void;
	isOpen: boolean;
	children?: React.ReactNode;
	title?: string;
	className?: React.ComponentProps<"div">["className"];
};

export default function Modal({
	isOpen,
	closeHandler,
	children,
	title,
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
					"relative m-auto min-w-105 overscroll-contain rounded-xl border border-neutral-800 bg-neutral-900",
					className
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center p-6">
					{title && <p className="text-lg text-neutral-300">{title}</p>}
					<button
						className="ml-auto text-neutral-500 hover:text-neutral-100"
						onClick={closeHandler}
					>
						<X size={16} />
					</button>
				</div>
				<div className="max-h-[65dvh] overflow-y-scroll px-6 xl:max-h-[50dvh]">
					{children}
				</div>
			</div>
		</div>
	);
}
