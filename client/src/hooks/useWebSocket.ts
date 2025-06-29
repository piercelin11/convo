import { env } from "@/config/env";
import { useRef, useEffect, useState, useCallback } from "react";

type WebSocketState = "CONNECTING" | "OPEN" | "CLOSED";

/**
 * 一個用於管理 WebSocket 連線生命週期的 React Custom Hook。
 * 它封裝了連線、斷線、接收和發送訊息的底層邏輯。
 *
 * @param onMessage - (可選) 一個回呼函式，當從伺服器接收到訊息時觸發。**重要**務必使用 `useCallback` 包裝以防 WebSocket 因無關狀態變化時斷線並重新連線。
 * @returns 回傳一個物件，包含當前的連線狀態 `state` 和一個用來發送訊息的函式 `sendMessage`。
 */
export default function useWebSocket(onMessage?: (e: MessageEvent) => void) {
	const [state, setState] = useState<WebSocketState>("CONNECTING");
	const wsRef = useRef<null | WebSocket>(null);

	useEffect(() => {
		const ws = new WebSocket(env.VITE_WEBSOCKET_URL);
		wsRef.current = ws;
		ws.addEventListener("open", () => {
			setState("OPEN");
			console.info("已建立 WebSocket 連接");
		});

		ws.addEventListener("message", (e) => {
			if (onMessage) onMessage(e);
		});

		ws.addEventListener("close", () => {
			setState("CLOSED");
		});

		ws.addEventListener("error", () => {
			setState("CLOSED");
		});

		return () => {
			ws.close();
		};
	}, [onMessage]);

	const sendMessage = useCallback(
		(message: string) => {
			if (state === "OPEN") {
				if (wsRef.current) wsRef.current.send(message);
			} else {
				console.error("WebSocket 尚未連線，無法發送訊息。");
			}
		},
		[state]
	);

	return { state, sendMessage };
}
