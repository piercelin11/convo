import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";

export const UploadSchema = z.object({
	fileName: z.string().min(1, { message: "檔案名稱不能為空" }),
	contentType: z
		.string()
		.min(1, { message: "檔案類型不能為空" })
		.refine((val) => val.startsWith("image/"), { message: "只允許圖片檔案" }),
});

export type UploadSchemaType = z.infer<typeof UploadSchema>;

export const UploadResponseDataSchema = z.object({
	signedUrl: z.url(),
	imageUrl: z.url(),
});

export type UploadResponseDataSchemaType = z.infer<
	typeof UploadResponseDataSchema
>;

export const UploadResponseSchema = ApiResponseSchema.extend({
	data: UploadResponseDataSchema,
});

export type UploadResponseType = z.infer<typeof UploadResponseSchema>;
