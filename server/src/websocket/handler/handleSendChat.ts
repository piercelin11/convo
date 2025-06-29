import { SendChatPayloadSchemaType } from "@convo/shared";
import { WebSocket } from "ws";

export default function handleSendChat(
	ws: WebSocket,
	payload: SendChatPayloadSchemaType
) {
	console.log("send_chat");
}
