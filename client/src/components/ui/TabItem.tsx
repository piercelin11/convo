import { cn } from "@sglara/cn";
import Button from "./Button";

type TabItemProps = {
	onClick: () => void;
	isSelected: boolean;
	label: string;
};

export default function TabItem({ onClick, isSelected, label }: TabItemProps) {
	return (
		<Button
			className={cn(
				"rounded-t-xl rounded-b-none bg-transparent px-2 py-2 text-neutral-400 hover:bg-neutral-800",
				{
					"text-primary-500 border-primary-500 hover:text-primary-500 border-b-1":
						isSelected,
				}
			)}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}
