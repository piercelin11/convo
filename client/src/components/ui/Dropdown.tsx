import { cn } from "@sglara/cn";
import type React from "react";
import { cloneElement, useEffect, useRef, useState } from "react";
import { DropdownItem } from "./DropdownItem";

type DropdownProps = {
	/**
	 * 觸發下拉選單的 `button` 元素
	 */
	trigger: React.ReactElement<React.ComponentProps<"button">>;
	/**
	 * 下拉選單對齊觸發器的位置
	 * @default left
	 */
	align?: "left" | "right";
	children: React.ReactNode;
};

/**
 * 一個可以讓被包裹元件素擁有觸發下拉選單功能的元件
 *
 * @param props - Dropdown 元件的屬性
 * @param props.trigger - 觸發下拉選單的元素，目前必須是 `button` 元素。**必填**。
 * @param props.align - （可選）下拉選單對齊觸發器的位置。
 * @param props.children - 下拉選單內的內容。建議由 `DropdownItem` {@link DropdownItem} 或 `<li>` 元素構成。**必填**。
 * @returns 一個能透過點擊觸發下拉選單的 JSX 元素。
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<IconBtn><Menu /></IconBtn>}>
 * {options.map((item) => (
 * <DropdownItem key={item}>{item}</DropdownItem>
 * ))}
 * </Dropdown>
 * ```
 */
export default function Dropdown({
	trigger,
	align = "left",
	children,
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLUListElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const clonedTrigger = cloneElement(trigger, {
		onClick: () => setIsOpen((prev) => !prev),
		ref: triggerRef,
		"aria-haspopup": "menu",
		"aria-expanded": isOpen,
	});

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node) &&
				!triggerRef.current?.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	return (
		<>
			<div className="relative z-10">
				{clonedTrigger}

				<ul
					role="menu"
					ref={dropdownRef}
					className={cn(
						"absolute min-w-[200px] rounded-xl border border-neutral-800 bg-neutral-900/95 p-1 text-sm shadow-lg shadow-neutral-950/30 transition-all duration-200",
						{
							"pointer-events-none -mt-2 opacity-0": !isOpen,
							"mt-2 opacity-100": isOpen,
							"right-0": align === "right",
						}
					)}
					onClick={() => setIsOpen(false)}
					aria-hidden={!isOpen}
				>
					{children}
				</ul>
			</div>
		</>
	);
}
