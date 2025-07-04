import { cn } from "@sglara/cn";
import React from "react";
import { Check } from "react-feather";

type CheckBoxProps = {
	checked: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function CheckBox({
	checked,
	className,
	...props
}: CheckBoxProps) {
	return (
		<div
			className={cn(
				"flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-neutral-700 hover:border-neutral-400",
				className,
				{
					"border-neutral-400 bg-neutral-800": checked,
				}
			)}
			{...props}
		>
			{checked && <Check size={16} />}
		</div>
	);
}
