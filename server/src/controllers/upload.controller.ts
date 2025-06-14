import { deleteImg } from "@/services/upload.service.js";
import {
	AuthenticationError,
	AuthorizationError,
	getS3PresignedUrl,
} from "@/utils/index.js";
import { DeleteImgSchemaType, UploadImgSchemaType } from "@convo/shared";
import { Request, Response } from "express";

export async function ImgUploadHandler(req: Request, res: Response) {
	const user = req.user;
	if (!user) throw new AuthorizationError();

	const { fileName, contentType, s3KeyPrefix } =
		req.body as UploadImgSchemaType;

	const { signedUrl, imageUrl } = await getS3PresignedUrl(
		s3KeyPrefix,
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
	const user = req.user;
	if (!user) throw new AuthenticationError();
	const { objectKey } = req.params as DeleteImgSchemaType;

	await deleteImg(objectKey, user.id);

	res.status(200).json({
		success: true,
		message: "成功刪除圖片",
	});
}
