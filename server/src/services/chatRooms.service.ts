import {
	AuthorizationError,
	BadRequestError,
	NotFoundError,
} from "@/utils/error.utils.js";
import * as chatRoomsDB from "@/db/chatRooms.db.js";
import { deleteS3Object, parseS3UrlParts } from "@/utils/s3.utils.js";
import { env } from "@/config/env.js";
import { userConnections } from "@/websocket/wss.js";
import { NewRoomMessageSchemaType } from "@convo/shared";

/**
 * 刪除指定聊天室。
 * 此操作會驗證使用者權限，並在聊天室成功刪除後，清理其在 S3 上關聯的圖片（如果圖片未被其他資源引用）。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @param userId - 執行刪除操作的使用者ID (UUID)。
 * @returns 被刪除的聊天室記錄。
 * @throws {NotFoundError} 如果聊天室不存在。
 * @throws {AuthorizationError} 如果使用者沒有刪除該聊天室的權限。
 */
export async function deleteChatRoom(roomId: string, userId: string) {
	//驗證使用者是否有刪除聊天室的權限
	const chatRoom = await chatRoomsDB.findChatRoomWithMembersByRoomId(roomId);
	if (!chatRoom) throw new NotFoundError("聊天室不存在");

	if (chatRoom.creator_id !== userId)
		throw new AuthorizationError("你沒有刪除該聊天室的權限");

	await chatRoomsDB.deleteChatRoomByRoomId(roomId);

	chatRoom.members.forEach((member) => {
		const ws = userConnections.get(member.id);
		if (ws) {
			const message: NewRoomMessageSchemaType = {
				event: "ROOM_CHANGE",
			};
			ws.send(JSON.stringify(message));
		}
	});

	const imgUrl = chatRoom.image_url;
	if (imgUrl) {
		const parsedUrl = parseS3UrlParts(imgUrl);
		if (parsedUrl && parsedUrl.bucket === env.S3_BUCKET_NAME)
			await deleteS3Object(parsedUrl.key);
	}

	return chatRoom;
}

/**
 * 更新指定聊天室的名稱和圖片。
 *
 * @param roomId - 聊天室的唯一識別碼 (UUID)。
 * @param userId - 執行編輯操作的使用者ID (UUID)。
 * @param roomName - 聊天室的新名稱。
 * @param [imgUrl] - 聊天室的新頭貼URL (可選，設為`null`可移除現有頭貼)。
 * @returns 更新後的聊天室記錄。
 * @throws {NotFoundError} 如果聊天室不存在。
 * @throws {AuthorizationError} 如果使用者沒有編輯該聊天室的權限。
 */
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

	chatRoomWithMembers.members.forEach((member) => {
		const ws = userConnections.get(member.id);
		if (ws) {
			const message: NewRoomMessageSchemaType = {
				event: "ROOM_CHANGE",
			};
			ws.send(JSON.stringify(message));
		}
	});

	const prevImgUrl = chatRoomWithMembers.image_url;

	//檢查原本是否有圖片
	if (prevImgUrl !== imgUrl && prevImgUrl) {
		const parsedUrl = parseS3UrlParts(prevImgUrl);
		if (parsedUrl && parsedUrl.bucket === env.S3_BUCKET_NAME)
			await deleteS3Object(parsedUrl.key);
	}

	return chatRoom;
}

/**
 * 建立新的聊天室。
 *
 * @param name - 聊天室的名稱。
 * @param creatorId - 創建聊天室的使用者ID (UUID)。
 * @param members - 聊天室的成ID。
 * @param img - (可選) 聊天室的圖片URL。
 * @returns 新創建的聊天室記錄。
 * @throws {BadRequestError} 如果成員中沒有包含創建者。
 */
export async function createChatRoom(
	name: string,
	creatorId: string,
	members: string[],
	img?: string | null
) {
	if (!members.includes(creatorId))
		throw new BadRequestError("[chatRoomDB]創建者 id 須包含在成員 id 中");

	const newChatRoom = await chatRoomsDB.createChatRoom(
		name,
		creatorId,
		members,
		img
	);

	members.forEach((id) => {
		const ws = userConnections.get(id);
		if (ws) {
			const message: NewRoomMessageSchemaType = {
				event: "ROOM_CHANGE",
			};
			ws.send(JSON.stringify(message));
		}
	});

	return newChatRoom;
}
