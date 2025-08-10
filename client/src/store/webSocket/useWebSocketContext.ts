import { useContext } from "react";
import WebSocketContext from "./WebSocketContext";

/**
 * 為 {@link WebSocketContext} 客製化的 useContext
 * @returns 為 {@link WebSocketContext} 客製化的 useContext
 */
export default function useWebSocketContext() {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("[useWebSocketContext]必須於 Provider 包裹的元件內使用");
	}

	return context;
}
