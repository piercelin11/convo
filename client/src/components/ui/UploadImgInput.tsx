import { Camera } from "react-feather";
import Avatar from "./Avatar";
import { useState } from "react";
import compressImg from "@/utils/compressor.utils";

type UploadFileInputProps = {
	setFile: React.Dispatch<React.SetStateAction<File | null>>;
	imgUrl?: string | null;
};

export default function UploadImgInput({
	setFile,
	imgUrl,
}: UploadFileInputProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(imgUrl || null);

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const fileList = e.target.files;

		if (!fileList || fileList.length === 0) {
			setFile(null);
			return;
		}

		const file = fileList[0];
		const compressedFile = await compressImg({ file });

		if (previewUrl) URL.revokeObjectURL(previewUrl);
		const url = URL.createObjectURL(compressedFile);

		setPreviewUrl(url);
		setFile(file);
	}

	return (
		<div className="relative mx-auto w-36">
			<Avatar className="h-full w-full" src={previewUrl} />
			<label
				htmlFor="room-profile-pic"
				className="absolute top-0 z-10 flex h-full w-full rounded-full opacity-0 hover:bg-neutral-950/40 hover:opacity-100"
			>
				<Camera size={30} className="m-auto text-neutral-400" />
				<input
					className="hidden"
					type="file"
					accept="image/*"
					name="room-profile-pic"
					id="room-profile-pic"
					onChange={handleFileChange}
				/>
			</label>
		</div>
	);
}
