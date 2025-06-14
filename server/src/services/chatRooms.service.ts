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

	const imgUrl = chatRoom.image_url;
	if (imgUrl) {
		const objectKey = parseS3UrlParts(imgUrl);
		if (objectKey) await deleteS3Object(objectKey);
	}

	return chatRoom;
}

export async function editChatRoom(
	roomId: string,
	userId: string,
	roomName: string,
	imgUrl?: string | null
) {
	//驗證使用者是否有編輯聊天室的權限
	const chatRoomWithMembers =
		await chatRoomsDB.findChatRoomWithMembersByRoomId(roomId);
	if (!chatRoomWithMembers) throw new NotFoundError("聊天室不存在");

	const memberIds = chatRoomWithMembers.members.map((member) => member.id);

	if (!memberIds.includes(userId))
		throw new AuthorizationError("你沒有編輯該聊天室的權限");

	const chatRoom = await chatRoomsDB.updateChatRoomData(
		roomId,
		roomName,
		imgUrl
	);

	const prevImgUrl = chatRoomWithMembers.image_url;

	//檢查原本是否有圖片
	if (prevImgUrl !== imgUrl && prevImgUrl) {
		const objectKey = parseS3UrlParts(prevImgUrl);
		if (objectKey) await deleteS3Object(objectKey);
	}

	return chatRoom;
}
