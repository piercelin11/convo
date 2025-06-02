import { cn } from "@sglara/cn";
import { AlertCircle, AlertTriangle, CheckCircle } from "react-feather";

type ResponseMessageProps = {
	type: "success" | "error" | "warning";
	message: string;
	border?: boolean;
};

const ICON_SIZE = 16;

export default function ResponseMessage({
	type,
	message,
	border = true,
}: ResponseMessageProps) {
	return (
		<div
			className={cn("flex items-center gap-1", {
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
