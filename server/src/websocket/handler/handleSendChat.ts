import {
	MessageDto,
	OutboundMessageSchemaType,
	SendChatPayloadSchemaType,
} from "@convo/shared";
import * as messagesDB from "@/db/messages.db.js";
import { roomConnections } from "../wss.js";

export default async function handleSendChat(
	payload: SendChatPayloadSchemaType
) {
	const { roomId, text, userId } = payload;
	let message: MessageDto | null = null;

	try {
		message = await messagesDB.createMessages(roomId, userId, text);
	} catch (error) {
		console.error("[handleSendChat]傳送聊天室訊息時發生未知錯誤:", error);
	}

	const room = roomConnections.get(roomId);
	if (!room) {
		console.error("[handleSendChat]沒有找到相符的聊天室");
		return;
	}
	if (!message) {
		console.error("[handleSendChat]輸入聊天訊息到資料庫失敗");
		return;
	}

	const data: OutboundMessageSchemaType = {
		event: "NEW_CHAT",
		payload: message,
	};
	room.forEach((ws) => {
		ws.send(JSON.stringify(data));
	});
}
