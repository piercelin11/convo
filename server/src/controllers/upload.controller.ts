import { deleteImg } from "@/services/upload.service.js";
import { AuthorizationError, getS3PresignedUrl } from "@/utils/index.js";
import { DeleteImgSchemaType, UploadImgSchemaType } from "@convo/shared";
import { Request, Response, NextFunction } from "express";
/**
 * 處理圖片上傳的 Presigned URL 請求。
 * 驗證使用者身份後，根據請求體中的檔案資訊生成一個 S3 預簽名 URL，允許前端直接上傳檔案到 S3。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 中介軟體附加的 `req.user`，且 `body` 應包含 `UploadImgSchemaType` 驗證過的檔案名稱、類型及 S3 Key 前綴。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含簽名 URL 和最終圖片 URL 的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權。
 */
export async function ImgUploadHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
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
	} catch (error) {
		next(error);
	}
}

/**
 * 處理刪除指定圖片的請求。
 * 驗證使用者身份和對圖片的權限，然後從 S3 刪除該圖片。
 *
 * @param req - Express 請求物件，應包含由 `authenticateToken` 中介軟體附加的 `req.user`，且 `params` 應包含 `DeleteImgSchemaType` 驗證過的 `objectKey`。
 * @param res - Express 響應物件，用於發送 JSON 響應。
 * @param next - 呼叫下一個中介軟體或錯誤處理器的回調函式。
 * @returns 包含成功刪除訊息的 JSON 響應。
 * @throws {AuthorizationError} 如果使用者未經授權。
 */
export async function deleteImgHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = req.user;
		if (!user) throw new AuthorizationError();
		const { objectKey } = req.params as DeleteImgSchemaType;

		await deleteImg(objectKey, user.id);

		res.status(200).json({
			success: true,
			message: "成功刪除圖片",
		});
	} catch (error) {
		next(error); // 將錯誤傳遞給全局錯誤處理中介軟體
	}
}
