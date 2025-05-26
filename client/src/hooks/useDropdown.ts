import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";

/**
 * 下拉選單 {@link Dropdown} 的 custom hook
 * @param trigger - 下拉選單的觸發器。**必填**。
 * @returns 下拉選單 {@link Dropdown} 中所需要的參數，包括 clonedTrigger、dropdownRef、isOpen、setIsOpen、handleKeyDown。
 */
export default function useDropdown(
	trigger: React.ReactElement<React.ComponentProps<"button">>
) {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

	const dropdownRef = useRef<HTMLUListElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuItemsRef = useRef<HTMLButtonElement[]>([]);

	const existingTriggerRef = trigger.props.ref;

	//將傳入的 trigger 原有的 ref 與 Dropdown 中定義的 triggerRef 合併
	const mergedTriggerRef = useCallback(
		(node: HTMLButtonElement) => {
			if (triggerRef) {
				triggerRef.current = node;
			}

			if (typeof existingTriggerRef === "function") {
				existingTriggerRef(node);
			} else if (
				existingTriggerRef &&
				typeof existingTriggerRef === "object" &&
				"current" in existingTriggerRef
			) {
				existingTriggerRef.current = node;
			}
		},
		[existingTriggerRef]
	);

	//獲得 Dropdown 選單內的選項 element
	const getMenuItem = useCallback(() => {
		if (dropdownRef.current) {
			return Array.from(
				dropdownRef.current.querySelectorAll<HTMLButtonElement>(
					"[role='menuitem']"
				)
			);
		}
		return [];
	}, []);

	//設置下拉選單項目到 focus 狀態
	useEffect(() => {
		if (isOpen) {
			menuItemsRef.current = getMenuItem();
			if (
				menuItemsRef.current.length > 0 &&
				focusedItemIndex >= 0 &&
				focusedItemIndex < menuItemsRef.current.length
			) {
				menuItemsRef.current.forEach((item, index) => {
					item.setAttribute(
						"tabindex",
						index === focusedItemIndex ? "0" : "-1"
					);
				});
				menuItemsRef.current[focusedItemIndex].focus();
			} else if (
				dropdownRef.current &&
				focusedItemIndex === -1 &&
				menuItemsRef.current.length > 0
			) {
				dropdownRef.current.focus();
			}
		}
		if (!isOpen && triggerRef.current) {
			setFocusedItemIndex(-1);
			triggerRef.current.focus();
		}
	}, [isOpen, getMenuItem, focusedItemIndex]);

	//控制選單內的鍵盤導航
	function handleKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
		const items = menuItemsRef.current;
		if (items.length === 0) return;

		let newIndex = focusedItemIndex;

		switch (e.key) {
			case "ArrowDown": {
				e.preventDefault();
				newIndex = (focusedItemIndex + 1) % items.length;
				break;
			}
			case "ArrowUp": {
				e.preventDefault();
				newIndex = (focusedItemIndex - 1 + items.length) % items.length;
				break;
			}
			case "Escape": {
				e.preventDefault();
				setIsOpen(false);
				if (triggerRef.current) triggerRef.current.focus();
				break;
			}
		}

		if (newIndex !== focusedItemIndex) setFocusedItemIndex(newIndex);
	}

	//複製傳入的觸發元件並為其加上無障礙屬性與點擊事件
	const clonedTrigger = cloneElement(trigger, {
		onClick: () => setIsOpen((prev) => !prev),
		ref: mergedTriggerRef,
		role: "button",
		"aria-haspopup": "menu",
		"aria-expanded": isOpen,
	});

	//下拉選單開啟時，點擊下拉選單以外的地方會關閉選單
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

	return { clonedTrigger, dropdownRef, isOpen, setIsOpen, handleKeyDown };
}
