import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "react-feather";
import IconBtn from "../ui/IconBtn";

import { type InboundMessageSchemaType } from "@convo/shared";
import { useSession } from "@/store/auth/useAuth";
import useWebSocketContext from "@/store/webSocket/useWebSocketContext";

type MessageInputAreaProps = {
	roomId: string;
};

/**
 * 負責聊天室中輸入訊息與其他傳送功能相關的區塊
 * @returns 一個包含`input`的 JSX 元素
 */
export default function MessageInputArea({ roomId }: MessageInputAreaProps) {
	const [input, setInput] = useState("");
	const { id: userId } = useSession();

	const { readyState, sendMessage } = useWebSocketContext();

	//初始化聊天室，將客戶端加入指定聊天室
	useEffect(() => {
		const joinRoomMessage: InboundMessageSchemaType = {
			type: "JOIN_ROOM",
			payload: {
				roomId,
			},
		};
		if (readyState === "OPEN") sendMessage(JSON.stringify(joinRoomMessage));

		return () => {
			const leaveRoomMessage: InboundMessageSchemaType = {
				type: "LEAVE_ROOM",
				payload: {
					roomId,
				},
			};
			if (readyState === "OPEN") sendMessage(JSON.stringify(leaveRoomMessage));
		};
	}, [roomId, sendMessage, readyState]);

	function handleInput(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInput(value);
	}

	//傳送訊息
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const sendChatMessage: InboundMessageSchemaType = {
			type: "SEND_CHAT",
			payload: {
				roomId,
				userId,
				text: input,
			},
		};
		if (readyState === "OPEN") {
			sendMessage(JSON.stringify(sendChatMessage));
			setInput("");
		} else console.warn("WebSocket 尚未連線");
	}

	return (
		<div className="px-8 py-4">
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="flex flex-1 items-center gap-2 rounded-xl bg-neutral-900 p-4"
			>
				<input
					type="text"
					onChange={handleInput}
					value={input}
					placeholder="Search"
					className="w-full flex-1 focus:outline-none"
				/>
				<IconBtn
					className="hover:bg-primary-700 bg-neutral-100 p-2.5 text-neutral-950 hover:text-neutral-100"
					type="submit"
				>
					<Send size={12} />
				</IconBtn>
			</form>
		</div>
	);
}
