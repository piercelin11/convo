import Avatar from "@/components/ui/Avatar";
import { env } from "@/config/env";

type SearchResultItemProps = {
	imgUrl: string | null;
	title: string;
	content?: string;
};

export default function SearchResultItem({
	imgUrl,
	title,
	content,
}: SearchResultItemProps) {
	return (
		<li className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-800">
			<Avatar src={imgUrl || env.VITE_USER_IMG_PLACEHOLDER} size={55} />
			<div className="flex-1 overflow-hidden pr-2">
				<div className="flex items-center">
					<p>{title}</p>
				</div>
				<div className="flex gap-4">
					<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
						{content}
					</p>
				</div>
			</div>
		</li>
	);
}
