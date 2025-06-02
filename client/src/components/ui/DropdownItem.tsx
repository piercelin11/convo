type DropdownItemProps = {
	children: React.ReactNode;
} & React.ComponentProps<"button">;

/**
 * 下拉選單內的清單項目。
 * @param props - DropdownItem 元件的屬性，以及其他所有未被明確解構的標準 HTML `<button>` 屬性 (例如 `onClick`, `disabled`, `aria-label` 等) 都會被收集到此物件中，並完整傳遞給原生的 `<button>` 元素。
 * @param props.children - 下拉選單按鈕裡的內容。**必填**。
 * @returns 一個包裹 `button` 的 `li` 元素。
 */
export function DropdownItem({ children, ...props }: DropdownItemProps) {
	return (
		<li>
			<button
				role="menuitem"
				tabIndex={-1}
				className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-neutral-400 hover:bg-neutral-950 hover:text-neutral-100 focus:bg-neutral-950"
				{...props}
			>
				{children}
			</button>
		</li>
	);
}
