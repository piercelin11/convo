import { getPresignedUrl } from "@/services/upload.service.js";
import { AuthorizationError } from "@/utils/index.js";
import { UploadSchemaType } from "@convo/shared";
import { Request, Response } from "express";

export async function chatRoomsImageUploadHandler(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const { fileName, contentType } = req.body as UploadSchemaType;

	const { signedUrl, imageUrl } = await getPresignedUrl(
		"chat-rooms",
		user.id,
		fileName,
		contentType
	);

	res.status(200).json({
		success: true,
		message: "生成 S3 簽名檔成功",
		data: {
			signedUrl,
			imageUrl,
		},
	});
}
