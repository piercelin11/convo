import { uploadService } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useUploadRoomImg() {
	return useMutation({
		mutationFn: async (file: File) => {
			const { signedUrl, imageUrl } =
				await uploadService.getChatRoomImgPresignedUrl({
					fileName: file.name,
					contentType: file.type,
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
