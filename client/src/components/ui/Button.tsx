import { cn } from "@sglara/cn";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva("w-full rounded-xl px-4 py-3", {
	variants: {
		variant: {
			primary:
				"bg-neutral-100 text-neutral-950 hover:bg-primary-950 hover:text-neutral-100",
			secondary: "bg-neutral-800 text-neutral-400 hover:bg-neutral-700",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants>;

/**
 * 一個可自訂樣式的通用按鈕元件。
 *
 * 此元件提供了一組預設樣式，並允許通過 `className` prop 傳入額外的 CSS class
 * 來進行樣式覆蓋或擴展。它也接受所有標準 HTML `<button>` 元素的屬性。
 *
 * @param props - Button 元件的屬性，以及其他所有未被明確解構的標準 HTML `<button>` 屬性 (例如 `onClick`, `disabled`, `aria-label` 等) 都會被收集到此物件中，並完整傳遞給原生的 `<button>` 元素。
 * @param props.children - 按鈕中顯示的內容，例如文字或圖示。**必填**。
 * @param props.variant - 按鈕的樣式。
 * @param props.type - (可選) 按鈕的 HTML `type` 屬性，預設為 "button"。可以是 "submit" 或 "reset"。
 * @param props.className - (可選) 附加到按鈕元素上的 CSS class 名稱，會與預設樣式合併。
 * @returns 一個 `<button>` JSX 元素。
 * @example
 * ```tsx
 * <Button
 * type="submit"
 * onClick={() => console.log('按鈕被點擊！')}
 * className="bg-blue-500 hover:bg-blue-700" // 添加或覆蓋樣式
 * disabled={isLoading}
 * >
 * 提交表單
 * </Button>
 * ```
 *
 * @remarks
 * - 預設樣式包含： `hover:bg-primary-950 w-full rounded-xl bg-neutral-100 px-4 py-3 font-medium text-neutral-950 hover:text-neutral-100`。
 * - `cn` 函式用於合併預設樣式和傳入的 `className`。
 */
export default function Button({
	children,
	className,
	variant,
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant, className }))}
			type={type}
			{...props}
		>
			{children}
		</button>
	);
}
