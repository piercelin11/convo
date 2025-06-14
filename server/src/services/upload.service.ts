import { AuthorizationError } from "@/utils/error.utils.js";
import { deleteS3Object } from "@/utils/s3.utils.js";

export async function deleteImg(objectKey: string, userId: string) {
	const objectOwnerId = objectKey.split("/")[1];
	if (objectOwnerId !== userId)
		throw new AuthorizationError("非圖片擁有者，沒有刪除圖片的權限。");

	await deleteS3Object(objectKey);
}
