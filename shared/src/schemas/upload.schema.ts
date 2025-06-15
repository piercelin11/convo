import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";

export const S3KeyPrefixSchema = z.literal(["chat-room", "user-avatar"]);

export type S3KeyPrefixSchemaType = z.infer<typeof S3KeyPrefixSchema>;

export const UploadImgSchema = z.object({
	fileName: z.string().min(1, { message: "檔案名稱不能為空" }),
	contentType: z
		.string()
		.min(1, { message: "檔案類型不能為空" })
		.refine((val) => val.startsWith("image/"), { message: "只允許圖片檔案" }),
	s3KeyPrefix: S3KeyPrefixSchema,
});

export type UploadImgSchemaType = z.infer<typeof UploadImgSchema>;

export const DeleteImgSchema = z.object({
	objectKey: z.string().min(1, { message: "物件鍵不能為空" }),
});

export type DeleteImgSchemaType = z.infer<typeof DeleteImgSchema>;

/**
 * 上傳檔案和 S3 相關的 API 回應資料結構中的 `data` 屬性結構。
 * 包含 `signedUrl` 以及預先產生的 `imageUrl` 屬性。
 */
export const UploadResponseDataSchema = z.object({
	signedUrl: z.url(),
	imageUrl: z.url(),
});

/**
 * 上傳檔案和 S3 相關的 API 回應資料型別中的 `data` 屬性型別。
 * 包含 `signedUrl` 以及預先產生的 `imageUrl` 屬性。
 */
export type UploadResponseDataSchemaType = z.infer<
	typeof UploadResponseDataSchema
>;

/**
 * 上傳檔案和 S3 相關的 API 回應資料結構。
 * API 回應中包含 {@link UploadResponseDataSchema} 的資料結構。
 */
export const UploadResponseSchema = ApiResponseSchema.extend({
	data: UploadResponseDataSchema,
});

/**
 * 上傳檔案和 S3 相關的 API 回應資料型別。
 * API 回應中包含 {@link UploadResponseDataSchemaType} 的資料型別。
 */
export type UploadResponseType = z.infer<typeof UploadResponseSchema>;
