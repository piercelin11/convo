import { AuthorizationError } from "@/utils/error.utils.js";
import { deleteS3Object } from "@/utils/s3.utils.js";

/**
 * 刪除指定 S3 物件。
 * 此服務包含權限驗證，確保只有物件的原始上傳者才能刪除該圖片。
 *
 * @param objectKey - 要刪除物件的完整 Key (例如 'user-uploads/userId/some-file.jpg')。
 * @param userId - 執行刪除操作的使用者ID (UUID)。該ID必須與`objectKey`中表示的圖片擁有者ID匹配。
 * @returns 無回傳值 (Promise resolves on success)。
 * @throws {AuthorizationError} 如果`userId`與`objectKey`中的圖片擁有者ID不匹配，表示沒有刪除權限。
 */
export async function deleteImg(objectKey: string, userId: string) {
	const objectOwnerId = objectKey.split("/")[1];
	if (objectOwnerId !== userId)
		throw new AuthorizationError("非圖片擁有者，沒有刪除圖片的權限。");

	await deleteS3Object(objectKey);
}
