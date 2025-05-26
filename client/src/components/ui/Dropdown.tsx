import { cn } from "@sglara/cn";
import type React from "react";
import { DropdownItem } from "./DropdownItem";
import useDropdown from "@/hooks/useDropdown";

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
	const { clonedTrigger, dropdownRef, isOpen, setIsOpen, handleKeyDown } =
		useDropdown(trigger);

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
					onKeyDown={handleKeyDown}
					tabIndex={-1}
				>
					{children}
				</ul>
			</div>
		</>
	);
}
