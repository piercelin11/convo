import { cn } from "@sglara/cn";
import type React from "react";

type AvatarProps = {
	src: string;
	/**
	 * @default 50
	 */
	size?: number;
} & React.ComponentProps<"image">;

/**
 * 使用者頭貼或聊天室頭貼
 * @param props - Avatar 元件的屬性。其他所有未被明確解構的標準 HTML `<img>` 屬性 (例如 `sizes`, `srcSet` 等) 都會被收集到此物件中，並完整傳遞給原生的 `<img>` 元素。
 * @param props.src - 頭貼的來源連結。**必填**。
 * @param props.size - （可選）頭貼的尺寸，會同時套用於 `img` 的 `width` 和 `height` 上。
 * @param props.className - (可選) 附加到圖片元素上的 CSS class 名稱，會與預設樣式合併。
 * @returns 一個圓形的 `img` 元素
 */
export default function Avatar({ src, size = 50, className }: AvatarProps) {
	return (
		<img
			src={src}
			className={cn("rounded-full", className)}
			width={size}
			height={size}
		/>
	);
}
