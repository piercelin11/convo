import useMessageQuery from "@/queries/message/useMessageQuery";
import ChatMessage from "./ChatMessage";

type MessageContainerProps = {
	roomId: string;
};

/**
 * 顯示所有聊天訊息的容器
 * @returns 一個作為聊天訊息容器的 JSX 元素
 */
export default function MessageContainer({ roomId }: MessageContainerProps) {
	const { data, isLoading } = useMessageQuery(roomId);

	return (
		<div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto overscroll-contain px-8">
			{isLoading || !data ? (
				<p>載入中...</p>
			) : (
				data.map((message) => (
					<ChatMessage key={message.id} message={message} />
				))
			)}
		</div>
	);
}
