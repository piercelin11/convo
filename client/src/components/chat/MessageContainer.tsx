import useMessageQuery from "@/queries/message/useMessageQuery";
import { useSession } from "@/store/auth/useAuth";
import { cn } from "@sglara/cn";

type MessageContainerProps = {
	roomId: string;
};

/**
 * 顯示所有聊天訊息的容器
 * @returns 一個作為聊天訊息容器的 JSX 元素
 */
export default function MessageContainer({ roomId }: MessageContainerProps) {
	const { data, isLoading } = useMessageQuery(roomId);
	const { id: userId } = useSession();

	return (
		<div className="flex flex-1 flex-col-reverse overflow-y-auto overscroll-contain px-8">
			{isLoading || !data ? (
				<p>載入中...</p>
			) : (
				data.map((message) => (
					<p
						className={cn({ "text-right": message.sender_id === userId })}
						key={message.id}
					>
						{message.content}
					</p>
				))
			)}
		</div>
	);
}
