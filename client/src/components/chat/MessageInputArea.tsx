import {
	useCallback,
	useEffect,
	useState,
	type ChangeEvent,
	type FormEvent,
} from "react";
import { Send } from "react-feather";
import IconBtn from "../ui/IconBtn";
import useWebSocket from "@/hooks/useWebSocket";
import {
	NewChatMessageSchema,
	type InboundMessageSchemaType,
	type MessageDto,
} from "@convo/shared";
import { useSession } from "@/store/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import messageKeys from "@/queries/message/messageKeys";
import z, { ZodError } from "zod/v4";

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

	const queryClient = useQueryClient();

	//處理伺服器端傳到客戶端的廣播訊息，並樂觀更新聊天室中的訊息
	const onMessageRecieved = useCallback(
		(e: MessageEvent) => {
			try {
				const validatedData = NewChatMessageSchema.parse(JSON.parse(e.data));
				const event = validatedData.event;
				const messages = validatedData.payload;

				if (event === "NEW_CHAT") {
					queryClient.setQueryData(
						messageKeys.room(roomId),
						(oldData: MessageDto[]) => {
							if (!oldData) return [messages];
							return [messages, ...oldData];
						}
					);
					queryClient.invalidateQueries({ queryKey: messageKeys.room(roomId) });
				}
			} catch (error) {
				if (error instanceof SyntaxError) {
					console.error(
						"[MessageInputArea]JSON 解析錯誤：收到了無效的 JSON 格式字串。",
						error.message
					);
				} else if (error instanceof ZodError) {
					const fieldError = z.flattenError(error).fieldErrors;
					console.error(
						"[MessageInputArea]伺服器傳來的 WebSocket 訊息結構錯誤。",
						fieldError
					);
				} else
					console.error(
						"[MessageInputArea]接收伺服器端回傳的 WebSocket 訊息時出現未預期錯誤。",
						error
					);
			}
		},
		[roomId, queryClient]
	);

	//負責連線到後端的 WebSocket
	const { state, sendMessage } = useWebSocket(onMessageRecieved);

	//初始化聊天室，將客戶端加入指定聊天室
	useEffect(() => {
		const joinRoomMessage: InboundMessageSchemaType = {
			type: "JOIN_ROOM",
			payload: {
				roomId,
			},
		};
		if (state === "OPEN") sendMessage(JSON.stringify(joinRoomMessage));
	}, [roomId, sendMessage, state]);

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
		if (state === "OPEN") {
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
