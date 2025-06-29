import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Button from "../ui/Button";
import { Send } from "react-feather";
import IconBtn from "../ui/IconBtn";

/**
 * 負責聊天室中輸入訊息與其他傳送功能相關的區塊
 * @returns 一個包含`input`的 JSX 元素
 */
export default function MessageInputArea() {
	const [input, setInput] = useState("");
	const wsRef = useRef<null | WebSocket>(null);

	function handleInput(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInput(value);
	}
	useEffect(() => {
		console.log("object")
		const ws = new WebSocket("ws://localhost:3000");
		wsRef.current = ws;
		ws.addEventListener("open", () => {
			console.log("已建立 WebSocket 連接");
		});

		return () => {
			ws.close();
		};
	}, []);
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
						if (wsRef.current) wsRef.current.send(input);
					}}
				>
					<Send size={14} />
				</IconBtn>
			</div>
		</div>
	);
}
