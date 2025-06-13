import { env } from "@/config/env.js";
import { InternalServerError } from "@/utils/error.utils.js";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3Client = new S3Client({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});
const BUCKET_NAME = env.S3_BUCKET_NAME;

export async function getPresignedUrl(
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
		const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

		return { signedUrl, imageUrl };
	} catch (error) {
		console.error("生成預簽名 URL 時發生未知錯誤:", error);
		throw new InternalServerError("生成預簽名 URL 時發生未知錯誤");
	}
}

export async function deleteImgByUrl(objectKey: string) {
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
