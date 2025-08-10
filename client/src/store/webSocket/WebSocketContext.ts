import type { WebSocketState } from "@/hooks/useWebSocket";
import { createContext } from "react";

type WebSocketContextType = {
	readyState: WebSocketState;
	sendMessage: (message: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);

export default WebSocketContext;
