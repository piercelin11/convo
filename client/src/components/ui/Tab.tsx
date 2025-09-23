import TabItem from "./TabItem";

/**
 * @param id - Tab選項的唯一識別符，必須是獨一無二的。
 * @param label - 顯示於Tab選項上的文字。
 */
export type TabOptionType = {
	id: string;
	label: string;
};

type TabProps<T extends readonly TabOptionType[]> = {
	tabOptions: T;
	currentTabId: T[number]["id"];
	onTabChange: (newTabId: T[number]["id"]) => void;
};

export default function Tab<T extends readonly TabOptionType[]>({
	tabOptions,
	currentTabId,
	onTabChange,
}: TabProps<T>) {
	return (
		<div className="flex gap-2">
			{tabOptions.map((option) => (
				<TabItem
					key={option.id}
					onClick={() => onTabChange(option.id)}
					label={option.label}
					isSelected={option.id === currentTabId}
				/>
			))}
		</div>
	);
}
