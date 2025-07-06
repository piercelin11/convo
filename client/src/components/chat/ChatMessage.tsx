import type { MessageDto } from "@convo/shared";
import Avatar from "../ui/Avatar";
import { useSession } from "@/store/auth/useAuth";
import { cn } from "@sglara/cn";

type ChatMessageProps = {
	message: MessageDto;
};

export default function ChatMessage({ message }: ChatMessageProps) {
	const { id: userId } = useSession();
	const isSender = userId === message.sender_id;
	return (
		<div
			className={cn("flex gap-2", {
				"justify-end": isSender,
			})}
		>
			{!isSender && <Avatar src={message.sender_avatar_url} />}
			<div>
				{!isSender && (
					<p className="text-sm text-neutral-600">{message.sender_username}</p>
				)}
				<p>{message.content}</p>
			</div>
		</div>
	);
}
