import { useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "react-feather";

import IconBtn from "../ui/IconBtn";

import { type InboundMessageSchemaType, type MessageDto } from "@convo/shared";
import { useSession } from "@/store/auth/useAuth";
import useWebSocketContext from "@/store/webSocket/useWebSocketContext";
import { useQueryClient } from "@tanstack/react-query";
import messageKeys from "@/queries/message/messageKeys";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";

type MessageInputAreaProps = {
	roomId: string;
};

/**
 * 聊天室中用於輸入與傳送訊息的區域。
 *
 * @param props - MessageInputArea 元件的屬性。
 * @param props.roomId - 目前聊天室的 ID。
 * @returns 一個包含輸入框與傳送按鈕的表單 JSX 元素。
 */
export default function MessageInputArea({ roomId }: MessageInputAreaProps) {
	const [input, setInput] = useState("");
	const { id: userId, username, avatar_url } = useSession();

	const queryClient = useQueryClient();

	const { readyState, sendMessage } = useWebSocketContext();

	function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
		const value = e.target.value;
		setInput(value);
	}

	/**
	 * 處理表單提交事件，進行即時更新並透過 WebSocket 傳送訊息。
	 */
	const submitMessage = () => {
		const trimmedInput = input.trim();
		if (!trimmedInput) return;

		queryClient.setQueryData(
			messageKeys.room(roomId),
			(oldMessages: MessageDto[] | undefined) => {
				const message: MessageDto = {
					id: crypto.randomUUID(),
					sender_username: username,
					sender_avatar_url: avatar_url,
					created_at: new Date(),
					content: trimmedInput,
					sender_id: userId,
					room_id: roomId,
					read_by_count: 0,
				};
				if (!oldMessages) return [message];
				return [message, ...oldMessages];
			}
		);

		const sendChatMessage: InboundMessageSchemaType = {
			type: "SEND_CHAT",
			payload: {
				roomId,
				userId,
				text: trimmedInput,
			},
		};
		if (readyState === "OPEN") {
			sendMessage(JSON.stringify(sendChatMessage));
			setInput("");
		} else console.warn("WebSocket 尚未連線");
	};

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		submitMessage();
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submitMessage();
		}
	}

	return (
		<div className="px-8 py-4">
			<form
				onSubmit={handleSubmit}
				className="flex flex-1 items-end gap-2 rounded-xl bg-neutral-900 p-4"
			>
				<div className="mt-2 flex-1">
					<AutoResizeTextarea
						onChange={handleInput}
						onKeyDown={handleKeyDown}
						value={input}
						placeholder="輸入訊息..."
						rows={1}
					/>
				</div>
				<IconBtn
					className="hover:bg-primary-700 self-end bg-neutral-100 p-2.5 text-neutral-950 hover:text-neutral-100"
					type="submit"
				>
					<Send size={12} />
				</IconBtn>
			</form>
		</div>
	);
}
