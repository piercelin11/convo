import { env } from "@/config/env.js";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { InternalServerError } from "./error.utils.js";
import { nanoid } from "nanoid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});
const BUCKET_NAME = env.S3_BUCKET_NAME;

export async function deleteS3Object(objectKey: string) {
	try {
		const deleteParams = {
			Bucket: BUCKET_NAME,
			Key: objectKey,
		};
		const command = new DeleteObjectCommand(deleteParams);

		await s3Client.send(command);
	} catch (error) {
		console.error(`刪除雲端圖片 ${objectKey} 時發生錯誤:`, error);
		throw new InternalServerError("刪除雲端圖片時發生錯誤");
	}
}

export async function getS3PresignedUrl(
	uploadPath: "chat-rooms" | "user-avatar",
	userId: string,
	fileName: string,
	contentType: string
) {
	const s3Key = `${uploadPath}/${userId}/${nanoid()}-${fileName.replace(/\s+/g, "_")}`;
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

export function buildS3ImageUrl(objectKey: string) {
	const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
	return imageUrl;
}

export function parseS3UrlParts(s3Url: string): string | null {
	try {
		const url = new URL(s3Url);
		if (
			url.hostname.includes(".s3.") &&
			url.hostname.includes(".amazonaws.com")
		) {
			const objectKey = url.pathname.substring(1);
			return objectKey;
		}
		return null;
	} catch (e) {
		console.error("解析 S3 URL 失敗:", e);
		return null;
	}
}
