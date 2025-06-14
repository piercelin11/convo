import { AuthorizationError, NotFoundError } from "@/utils/error.utils.js";
import * as chatRoomsDB from "@/db/chatRooms.db.js";
import { deleteS3Object, parseS3UrlParts } from "@/utils/s3.utils.js";

export async function deleteChatRoom(roomId: string, userId: string) {
	//驗證使用者是否有刪除聊天室的權限
	const chatRoom = await chatRoomsDB.findChatRoomByRoomId(roomId);
	if (!chatRoom) throw new NotFoundError("聊天室不存在");

	if (chatRoom.creator_id !== userId)
		throw new AuthorizationError("你沒有刪除該聊天室的權限");

	await chatRoomsDB.deleteChatRoomByRoomId(roomId);

	//確認圖片沒有被其他聊天室引用
	if (chatRoom.image_url) {
		const imgUrl = chatRoom.image_url;
		const isImgUsed = !!(await chatRoomsDB.findChatRoomsByImgUrl(imgUrl))
			.length;

		//刪除圖片
		if (!isImgUsed) {
			const objectKey = parseS3UrlParts(imgUrl);
			if (objectKey) await deleteS3Object(objectKey);
		}
	}

	return chatRoom;
}
