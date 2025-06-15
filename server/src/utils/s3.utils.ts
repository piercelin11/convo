import { env } from "@/config/env.js";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { InternalServerError } from "./error.utils.js";
import { nanoid } from "nanoid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3KeyPrefixSchemaType } from "@convo/shared";

const s3Client = new S3Client({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});
const BUCKET_NAME = env.S3_BUCKET_NAME;

/**
 * 從 S3 Bucket 中刪除指定物件。
 *
 * @param objectKey - 要刪除物件的完整 Key (例如 'user-avatars/userId.jpg')。
 * @returns 無回傳值 (Promise resolves on success)。
 * @throws {InternalServerError} 如果刪除 S3 物件時發生錯誤。
 */
export async function deleteS3Object(objectKey: string) {
	try {
		const deleteParams = {
			Bucket: BUCKET_NAME, // BUCKET_NAME 應從外部傳入或配置
			Key: objectKey,
		};
		const command = new DeleteObjectCommand(deleteParams);

		await s3Client.send(command);
	} catch (error) {
		console.error(`刪除雲端圖片 ${objectKey} 時發生錯誤:`, error);
		throw new InternalServerError("刪除雲端圖片時發生錯誤");
	}
}

/**
 * 生成一個 S3 預簽名 URL (Presigned URL) 用於上傳檔案。
 * 此 URL 允許前端直接將檔案上傳到 S3。
 *
 * @param s3KeyPrefix - S3 物件鍵的前綴 (例如 'user-uploads' 或 'room-avatars')，用於定義檔案在 S3 中的邏輯資料夾。
 * @param userId - 上傳檔案的使用者 ID。該 ID 會被包含在物件鍵中。
 * @param fileName - 原始檔案的名稱。
 * @param contentType - 檔案的 MIME Type (例如 'image/jpeg')。
 * @returns 包含簽名 URL (`signedUrl`) 和最終圖片 URL (`imageUrl`) 的物件。
 * @throws {InternalServerError} 如果生成預簽名 URL 時發生錯誤。
 */
export async function getS3PresignedUrl(
	s3KeyPrefix: S3KeyPrefixSchemaType,
	userId: string,
	fileName: string,
	contentType: string
) {
	const s3Key = `${s3KeyPrefix}/${userId}/${nanoid()}-${fileName.replace(/\s+/g, "_")}`;
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		ContentType: contentType,
		Key: s3Key,
	});

	try {
		const signedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 1000,
		});
		const imageUrl = buildS3ImageUrl(s3Key);

		return { signedUrl, imageUrl };
	} catch (error) {
		console.error("生成預簽名 URL 時發生未知錯誤:", error);
		throw new InternalServerError("生成預簽名 URL 時發生未知錯誤");
	}
}

/**
 * 根據 S3 物件鍵 (Object Key) 構建完整的 S3 公開圖片 URL。
 *
 * @param objectKey - S3 物件的完整鍵 (例如 'user-uploads/userId/some-file.jpg')。
 * @returns 完整的 S3 公開圖片 URL 字串。
 */
export function buildS3ImageUrl(objectKey: string) {
	const imageUrl = `https://${BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${objectKey}`;
	return imageUrl;
}

/**
 * 從 S3 URL 中安全地解析出 Bucket 名稱和 Object Key。
 *
 * @param s3Url - 完整的 S3 物件 URL。
 * @returns 包含 `bucket` 和 `key` 屬性的物件，如果解析失敗或不是有效的 S3 URL 則返回 `null`。
 */
export function parseS3UrlParts(
	s3Url: string
): { bucket: string; key: string } | null {
	try {
		const url = new URL(s3Url);
		let bucketName: string | null = null;
		let objectKey: string | null = null;

		const hostname = url.hostname;
		const pathname = url.pathname;

		if (hostname.startsWith("s3.") && hostname.includes(".amazonaws.com")) {
			const pathSegments = pathname
				.split("/")
				.filter((segment) => segment !== "");
			if (pathSegments.length >= 1) {
				bucketName = pathSegments[0];
				objectKey = pathSegments.slice(1).join("/");
			}
		} else {
			return null;
		}

		if (bucketName && objectKey) {
			return { bucket: bucketName, key: objectKey };
		}

		return null;
	} catch (e) {
		console.error("解析 S3 URL 失敗:", e);
		return null;
	}
}
