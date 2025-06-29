import { useEffect, useState, type ChangeEvent } from "react";
import { Send } from "react-feather";
import IconBtn from "../ui/IconBtn";
import useWebSocket from "@/hooks/useWebSocket";
import type { InboundMessageSchemaType } from "@convo/shared";

type MessageInputAreaProps = {
	roomId: string;
};

/**
 * 負責聊天室中輸入訊息與其他傳送功能相關的區塊
 * @returns 一個包含`input`的 JSX 元素
 */
export default function MessageInputArea({ roomId }: MessageInputAreaProps) {
	const [input, setInput] = useState("");

	const { state, sendMessage } = useWebSocket();

	useEffect(() => {
		const joinRoomPayload: InboundMessageSchemaType = {
			type: "join_room",
			payload: {
				roomId,
			},
		};
		if (state === "OPEN") {
			sendMessage(JSON.stringify(joinRoomPayload));
		}
	}, [roomId, sendMessage, state]);

	function handleInput(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInput(value);
	}

	return (
		<div className="px-16 py-4">
			<div className="flex flex-1 items-center gap-2 rounded-xl bg-neutral-900 p-4">
				<input
					type="text"
					onChange={handleInput}
					value={input}
					placeholder="Search"
					className="w-full flex-1 focus:outline-none"
				/>
				<IconBtn
					className="bg-neutral-100 p-2 text-neutral-950 hover:text-neutral-100"
					onClick={() => {
						sendMessage(input);
					}}
				>
					<Send size={14} />
				</IconBtn>
			</div>
		</div>
	);
}
