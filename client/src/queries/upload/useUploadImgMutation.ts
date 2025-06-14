import { uploadService } from "@/api";
import type { S3KeyPrefixSchemaType } from "@convo/shared";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useUploadImgMutation() {
	return useMutation({
		mutationFn: async ({
			file,
			s3KeyPrefix,
		}: {
			file: File;
			s3KeyPrefix: S3KeyPrefixSchemaType;
		}) => {
			const { signedUrl, imageUrl } = await uploadService.getImgPresignedUrl({
				fileName: file.name,
				contentType: file.type,
				s3KeyPrefix,
			});

			await uploadService.uploadImgToS3(signedUrl, file);
			return imageUrl;
		},
		onError: (error) => {
			if (error instanceof AxiosError)
				console.error("上傳聊天室圖片時發生錯誤:", error);
			else console.error("上傳聊天室圖片時發生未預期的錯誤:", error);
		},
	});
}
