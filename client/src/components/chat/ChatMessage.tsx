import type { MessageDto } from "@convo/shared";
import Avatar from "../ui/Avatar";
import { useSession } from "@/store/auth/useAuth";
import { cn } from "@sglara/cn";
import { format } from "date-fns";

type ChatMessageProps = {
	message: MessageDto;
};

export default function ChatMessage({ message }: ChatMessageProps) {
	const { id: userId } = useSession();
	const isSender = userId === message.sender_id;

	const timestamp = format(new Date(message.created_at), "p");

	if (isSender) {
		return (
			<div className="flex items-end justify-end gap-2">
				<div className="text-right text-xs text-neutral-500">
					<p>{message.read_by_count > 0 ? "已讀" : ""}</p>
					<p>{timestamp}</p>
				</div>

				<div
					className={cn(
						"bg-primary-600 max-w-xs rounded-2xl px-4 py-2.5 text-white sm:max-w-md",
						"rounded-br-none"
					)}
				>
					<p className="break-words whitespace-pre-wrap">{message.content}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-end justify-start gap-2">
			<Avatar src={message.sender_avatar_url} />

			<div className="flex flex-col items-start gap-1">
				<p className="ml-3 text-sm text-neutral-500">
					{message.sender_username}
				</p>
				<div
					className={cn(
						"max-w-xs rounded-2xl bg-neutral-800 px-4 py-2.5 text-neutral-100 sm:max-w-md",
						"rounded-bl-none"
					)}
				>
					<p className="break-words whitespace-pre-wrap">{message.content}</p>
				</div>
			</div>

			<p className="text-xs text-neutral-500">{timestamp}</p>
		</div>
	);
}
