import { useCallback, type ReactNode } from "react";
import WebSocketContext from "./WebSocketContext";
import useWebSocket from "@/hooks/useWebSocket";
import { OutboundMessageSchema } from "@convo/shared";
import { useQueryClient } from "@tanstack/react-query";
import * as MessageHandler from "./handler";
import z from "zod/v4";
import { useAuth } from "../auth/useAuth";

type WebSocketProviderProps = {
	children: ReactNode;
};

export default function WebSocketProvider({
	children,
}: WebSocketProviderProps) {
	const { isAuthenticated, user } = useAuth();

	return (
		<>
			{isAuthenticated ? (
				<WebSocketManager userId={user!.id}>{children}</WebSocketManager>
			) : (
				children
			)}
		</>
	);
}

function WebSocketManager({
	children,
	userId,
}: WebSocketProviderProps & { userId: string }) {
	const queryClient = useQueryClient();
	const handleOnMessage = useCallback(
		(e: MessageEvent) => {
			let message;
			try {
				message = JSON.parse(e.data);
			} catch (error) {
				console.error(
					"[WebSocketProvider]JSON 解析錯誤：收到無效的 JSON 格式字串",
					error
				);
			}

			const validated = OutboundMessageSchema.safeParse(message);
			if (!validated.success) {
				const fieldError = z.flattenError(validated.error).fieldErrors;
				console.error(
					"[WebSocketProvider]伺服器傳來的 WebSocket 訊息結構錯誤。",
					fieldError
				);
				return;
			}

			const validatedData = validated.data;

			switch (validatedData.event) {
				case "NEW_CHAT": {
					MessageHandler.handleNewMessage(
						queryClient,
						userId,
						validatedData.payload
					);
					break;
				}
				case "ROOM_CHANGE": {
					MessageHandler.handleNewRoom(queryClient);
					break;
				}
				case "ERROR": {
					console.error("收到 WebSocket 伺服器端的錯誤訊息");
					console.error(validatedData.payload.message);
					break;
				}
				default: {
					console.warn("該 WebSocket 伺服器端訊息事件尚未被分類處理");
				}
			}
		},
		[queryClient, userId]
	);

	const { readyState, sendMessage } = useWebSocket(handleOnMessage);

	return (
		<WebSocketContext.Provider value={{ readyState, sendMessage }}>
			{children}
		</WebSocketContext.Provider>
	);
}
