import { cn } from "@sglara/cn";
import type React from "react";

type FormInputProps = {
	id: string;
	name: string;
	className?: string;
	errorMessage?: string;
	label?: string;
} & Omit<React.ComponentProps<"input">, "id" | "name">;

/**
 * 一個可複用的表單輸入欄位元件，包含一個標籤 (`<label>`) 和一個輸入框 (`<input>`)。
 *
 * @param props - FormInput 元件的屬性，包含其他所有標準 `<input>` 屬性 (如 `type`, `value`, `onChange`, `placeholder`, `className` 等) 都會被傳遞給 `<input>` 元素。。
 * @param props.id - 輸入欄位的唯一 ID，用於 `<input id>` 和 `<label htmlFor>`。**必填**。
 * @param props.name - 輸入欄位的名稱，用於表單提交。**必填**。
 * @param props.className - (可選) 為 input 添加樣式，若與預設樣式衝突會直接覆蓋預設樣式。
 * @param props.label - (可選) 顯示在輸入欄位上方的標籤文字。
 * @param props.errorMessage - (可選) 顯示在輸入欄位下方的錯誤訊息。
 * @returns 一個包含 `<label>` 和 `<input>` 的 JSX 元素。
 * @example
 * ```tsx
 * <FormInput
 * id="username-field"
 * name="username"
 * label="使用者名稱："
 * type="text"
 * placeholder="請輸入您的使用者名稱"
 * required
 * className="my-custom-input-class" // 這個 className 會應用到 <input> 標籤
 * />
 * ```
 */
export default function FormInput({
	id,
	name,
	label,
	className,
	errorMessage,
	...props
}: FormInputProps) {
	return (
		<label className="flex flex-col gap-2 text-sm" htmlFor={id}>
			{label}
			<input
				className={cn(
					"w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-500 outline-1 outline-neutral-700 focus:text-neutral-50 focus:outline-neutral-50",
					className
				)}
				name={name}
				id={id}
				autoComplete="off"
				{...props}
			/>
			{errorMessage && <p className="text-danger">{errorMessage}</p>}
		</label>
	);
}
