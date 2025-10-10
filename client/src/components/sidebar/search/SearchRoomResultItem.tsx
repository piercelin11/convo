import Avatar from "@/components/ui/Avatar";
import { env } from "@/config/env";

type SearchRoomResultItemProps = {
	id: string;
	imageUrl: string | null;
	name: string;
	content?: string | null;
};

export default function SearchRoomResultItem({
	imageUrl,
	name,
	content,
}: SearchRoomResultItemProps) {
	return (
		<li className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-800">
			<Avatar src={imageUrl || env.VITE_USER_IMG_PLACEHOLDER} size={55} />
			<div className="flex-1 overflow-hidden pr-2">
				<p className="overflow-hidden text-ellipsis whitespace-nowrap">
					{name}
				</p>

				<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
					{content}
				</p>
			</div>
		</li>
	);
}
