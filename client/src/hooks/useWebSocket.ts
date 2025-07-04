import { env } from "@/config/env";
import { useRef, useEffect, useState, useCallback } from "react";

type WebSocketState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_BASE = 1000;

/**
 * 一個用於管理 WebSocket 連線生命週期的 React Custom Hook。
 * 它封裝了連線、斷線、接收和發送訊息的底層邏輯。
 *
 * @param onMessage - (可選) 一個回呼函式，當從伺服器接收到訊息時觸發。**重要**：務必使用 `useCallback` 包裝以防 WebSocket 因無關狀態變化時斷線並重新連線。
 * @returns 回傳一個物件，包含當前的連線狀態 `state` 和一個用來發送訊息的函式 `sendMessage`。
 */
export default function useWebSocket(onMessage?: (e: MessageEvent) => void) {
	const [state, setState] = useState<WebSocketState>("CONNECTING");
	const wsRef = useRef<null | WebSocket>(null);

	const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectAttempt = useRef(0);

	const connect = useCallback(() => {
		if (wsRef.current && wsRef.current.readyState < 2) return;
		if (reconnectTimerRef.current) {
			clearTimeout(reconnectTimerRef.current);
		}

		if (reconnectAttempt.current >= MAX_RECONNECT_ATTEMPTS) {
			console.warn("已達最大重新連線次數，放棄連線");
			return;
		}

		//console.info(`正在嘗試第${reconnectAttempt.current + 1}次連線`);
		setState("CONNECTING");

		const ws = new WebSocket(env.VITE_WEBSOCKET_URL);
		wsRef.current = ws;

		function handleOpen() {
			setState("OPEN");
			reconnectAttempt.current = 0;
			console.info("已建立 WebSocket 連接");
		}

		function handleMessage(e: MessageEvent) {
			if (onMessage) onMessage(e);
		}

		function handleClose() {
			setState("CLOSED");
			//console.info("WebSocket 連線關閉，準備重連...");

			const timout =
				RECONNECT_DELAY_BASE * Math.pow(2, reconnectAttempt.current);
			reconnectTimerRef.current = setTimeout(connect, timout);

			reconnectAttempt.current++;
		}

		function handleError() {
			setState("CLOSED");
		}

		ws.addEventListener("open", handleOpen);
		ws.addEventListener("message", handleMessage);
		ws.addEventListener("close", handleClose);
		ws.addEventListener("error", handleError);

		return () => {
			ws.removeEventListener("open", handleOpen);
			ws.removeEventListener("message", handleMessage);
			ws.removeEventListener("close", handleClose);
			ws.removeEventListener("error", handleError);
		};
	}, [onMessage]);

	useEffect(() => {
		const cleanUpEventListener = connect();
		return () => {
			if (reconnectTimerRef.current) {
				clearTimeout(reconnectTimerRef.current);
			}
			if (cleanUpEventListener) cleanUpEventListener();

			if (wsRef.current) wsRef.current.close();
		};
	}, [connect]);

	const sendMessage = useCallback((message: string) => {
		if (wsRef.current && wsRef.current.readyState === 1) {
			wsRef.current.send(message);
		} else {
			console.warn("WebSocket 尚未連線，無法發送訊息。");
		}
	}, []);

	return { state, sendMessage };
}
