import useMessageQuery from "@/queries/message/useMessageQuery";

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
		<div className="flex flex-1 flex-col-reverse overflow-y-auto overscroll-contain">
			{isLoading || !data ? (
				<p>載入中...</p>
			) : (
				data.map((message) => <p key={message.id}>{message.content}</p>)
			)}
		</div>
	);
}
