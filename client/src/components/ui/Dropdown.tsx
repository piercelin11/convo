import { cn } from "@sglara/cn";
import type React from "react";
import { cloneElement, useState } from "react";
import { DropdownItem } from "./DropdownItem";

type DropdownProps = {
	/**
	 * 觸發下拉選單的 `button` 元素
	 */
	trigger: React.ReactElement<React.ComponentPropsWithoutRef<"button">>;
	children: React.ReactNode;
};

/**
 * 一個可以讓被包裹元件素擁有觸發下拉選單功能的元件
 *
 * @param props - Dropdown 元件的屬性
 * @param props.trigger - 觸發下拉選單的元素，目前必須是 `button` 元素。**必填**。
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
export default function Dropdown({ trigger, children }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);

	const clonedTrigger = cloneElement(trigger, {
		onClick: () => setIsOpen((prev) => !prev),
		"aria-haspopup": "menu",
		"aria-expanded": isOpen,
	});
	return (
		<>
			<div className="relative z-10">
				{clonedTrigger}
				<div
					className={cn(
						"absolute min-w-[200px] rounded-xl border border-neutral-800 bg-neutral-900/95 p-1 text-sm shadow-lg shadow-neutral-950/30 transition-all duration-200",
						{
							"pointer-events-none -mt-2 opacity-0": !isOpen,
							"mt-2 opacity-100": isOpen,
						}
					)}
					aria-hidden={!isOpen}
				>
					<ul>{children}</ul>
				</div>
			</div>
			<div
				className="absolute top-0 left-0 h-screen w-screen overflow-hidden"
				onClick={() => setIsOpen(false)}
				hidden={!isOpen}
			/>
		</>
	);
}
