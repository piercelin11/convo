import {
	UploadResponseSchema,
	type UploadResponseDataSchemaType,
	type UploadSchemaType,
} from "@convo/shared";
import axiosClient from "./client";
import axios from "axios";

export const uploadService = {
	getChatRoomImgPresignedUrl: async (
		fileData: UploadSchemaType
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
};
