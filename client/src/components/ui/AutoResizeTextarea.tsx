import { cn } from "@sglara/cn";
import { type TextareaHTMLAttributes, useEffect, useRef } from "react";

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * 一個可以根據內容自動調整高度的 textarea 元件。
 * 它封裝了高度計算的邏輯，並接受所有標準的 `<textarea>` 屬性。
 *
 * @param props - AutoResizeTextarea 元件的屬性，繼承所有標準 `<textarea>` 屬性。
 * @param props.className - (可選) 附加到 textarea 元素上的 CSS class 名稱，會與預設樣式合併。
 * @param props.value - textarea 的值，用於觸發高度重新計算。
 * @returns 一個會自動調整高度的 `<textarea>` JSX 元素。
 */
export default function AutoResizeTextarea({
	className,
	value,
	...props
}: AutoResizeTextareaProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto"; // 先重置高度以正確計算 scrollHeight
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [value]);

	return (
		<textarea
			ref={textareaRef}
			className={cn(
				"max-h-24 w-full flex-1 resize-none overflow-y-auto bg-transparent focus:outline-none",
				className
			)}
			value={value}
			{...props}
		/>
	);
}
