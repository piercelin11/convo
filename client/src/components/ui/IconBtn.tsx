import { cn } from "@sglara/cn";
import type React from "react";

type IconBtnProps = {
	/**
	 * 按鈕內的icon圖示
	 */
	children: React.ReactNode;
} & React.ComponentProps<"button">;

/**
 * 一個包裹 icon 元素的的圓形按鈕
 * @param props - IconBtn 元件的屬性，以及其他所有未被明確解構的標準 HTML `<button>` 屬性 (例如 `onClick`, `disabled`, `aria-label` 等) 都會被收集到此物件中，並完整傳遞給原生的 `<button>` 元素。
 * @param props.children - 按鈕內的 icon，建議以 SVG 元素為主。**必填**。
 * @param props.className - (可選) 附加到按鈕元素上的 CSS class 名稱，會與預設樣式合併。
 * @returns 一個 `<button>` JSX 元素。
 */
export default function IconBtn({
	children,
	className,
	...props
}: IconBtnProps) {
	return (
		<button
			className={cn(
				"rounded-full p-2 text-neutral-500 hover:bg-neutral-800 [&_svg]:size-5",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}
