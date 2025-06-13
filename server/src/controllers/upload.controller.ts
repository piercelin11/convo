import { deleteImgByUrl, getPresignedUrl } from "@/services/upload.service.js";
import { AuthorizationError } from "@/utils/index.js";
import { DeleteImgSchemaType, UploadImgSchemaType } from "@convo/shared";
import { Request, Response } from "express";

export async function chatRoomsImgUploadHandler(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const { fileName, contentType } = req.body as UploadImgSchemaType;

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

export async function deleteImgHandler(req: Request, res: Response) {
	const { objectKey } = req.params as DeleteImgSchemaType;
	await deleteImgByUrl(objectKey);

	res.status(200).json({
		success: true,
		message: "成功刪除圖片",
	});
}
