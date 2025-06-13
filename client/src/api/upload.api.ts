import {
	UploadResponseSchema,
	type UploadResponseDataSchemaType,
	type UploadImgSchemaType,
} from "@convo/shared";
import axiosClient from "./client";
import axios from "axios";
import { getObjectKeyFromS3Url } from "@/utils";

export const uploadService = {
	getChatRoomImgPresignedUrl: async (
		fileData: UploadImgSchemaType
	): Promise<UploadResponseDataSchemaType> => {
		const { data } = await axiosClient.post(
			"/upload/presigned-url/room-image",
			fileData
		);
		const validatedData = UploadResponseSchema.parse(data);
		return validatedData.data;
	},
	uploadImgToS3: async (presignedUrl: string, file: File) => {
		await axios.put(presignedUrl, file, {
			headers: { "Content-Type": file.type },
		});
	},
	deleteImgFromS3: async (imgUrl: string) => {
		const objectKey = getObjectKeyFromS3Url(imgUrl);
		if (!objectKey) {
			throw new Error("無效的圖片 URL，無法解析物件鍵。");
		}
		const encodedObjectKey = encodeURIComponent(objectKey);
		await axiosClient.delete(`/upload/${encodedObjectKey}`);
	},
};
