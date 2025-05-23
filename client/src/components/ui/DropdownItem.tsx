type DropdownItemProps = {
	children: React.ReactNode;
};

/**
 * 下拉選單內的清單項目。
 * @param props - DropdownItem 元件的屬性
 * @param props.children - 下拉選單按鈕裡的內容。**必填**。
 * @returns 一個包裹 `button` 的 `li` 元素。
 */
export function DropdownItem({ children }: DropdownItemProps) {
	return (
		<li>
			<button
				role="menuitem"
				tabIndex={-1}
				className="w-full rounded-lg px-4 py-2 text-left hover:bg-neutral-950"
			>
				{children}
			</button>
		</li>
	);
}
