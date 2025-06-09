import { cn } from "@sglara/cn";
import { AlertCircle, AlertTriangle, CheckCircle } from "react-feather";

type ResponseMessageProps = {
	type: "success" | "error" | "warning";
	message?: string | null;
	border?: boolean;
};

const ICON_SIZE = 18;

/**
 * 主要用於呈現 API 回傳訊息的元件。
 * @param props - 元件所需要的參數。
 * @param props.type - 回傳訊息的種類，分為「成功」、「錯誤」、「警告」三種。
 * @param props.message - 訊息內容本身。
 * @param props.border - 是否有圓弧邊匡，預設為 `false`。
 * @returns 一個根據種類決定樣式的訊息元件。
 */
export default function ResponseMessage({
	type,
	message,
	border = true,
}: ResponseMessageProps) {
	if (!message) return;
	return (
		<div
			className={cn("flex items-center gap-2", {
				"rounded-xl border px-3 py-4": border,
				"text-success": type === "success",
				"text-danger": type === "error",
				"text-warning": type === "warning",
			})}
		>
			{type === "success" ? (
				<CheckCircle size={ICON_SIZE} />
			) : type === "warning" ? (
				<AlertCircle size={ICON_SIZE} />
			) : (
				<AlertTriangle size={ICON_SIZE} />
			)}
			<p className="text-sm">{message}</p>
		</div>
	);
}
