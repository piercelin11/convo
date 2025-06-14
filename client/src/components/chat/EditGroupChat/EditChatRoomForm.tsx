import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import UploadFileInput from "@/components/ui/UploadImgInput";
import { useChatQuery } from "@/queries/chat/useChatQuery";
import useEditRoomMutation from "@/queries/chat/useEditRoomMutation";
import useUploadImgMutation from "@/queries/upload/useUploadImgMutation";
import useModalContext from "@/store/modal/useModalContext";
import type { ChatPageParams } from "@/types/params";
import { EditChatRoomSchema } from "@convo/shared";
import { useState } from "react";
import { useParams } from "react-router-dom";
import z from "zod/v4";

/* type Step2EnterRoomInfoProps = {

}; */

export default function EditChatRoomForm() {
	const { roomId } = useParams<ChatPageParams>();
	const { data, isLoading } = useChatQuery(roomId!);

	const { setModalKey } = useModalContext();
	const [name, setName] = useState(data?.name || undefined);
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { mutateAsync: uploadRoomImg, isPending: isUploading } =
		useUploadImgMutation();

	const { mutateAsync: editRoom, isPending: isEditing } = useEditRoomMutation();

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let imageUrl: null | string = data?.image_url || null;

		if (file) {
			imageUrl = await uploadRoomImg({ file, s3KeyPrefix: "chat-room" });
		}

		const newRoomData = {
			id: roomId,
			name,
			img: imageUrl,
		};

		const validated = EditChatRoomSchema.safeParse(newRoomData);
		if (!validated.success) {
			const fieldErrors = z.flattenError(validated.error).fieldErrors;
			setError(fieldErrors.name ? fieldErrors.name[0] : null);
			return;
		} else {
			setError(null);
		}

		await editRoom(validated.data);

		setModalKey(null);
	}

	if (isLoading) return <p>載入中...</p>;
	return (
		<form
			className="flex h-full flex-col space-y-5 pb-26"
			onSubmit={handleSubmit}
		>
			<UploadFileInput setFile={setFile} imgUrl={data?.image_url} />
			<FormInput
				id="group-name"
				name="group"
				label="聊天室名稱"
				type="text"
				placeholder="eg: Convo"
				onChange={handleInputChange}
				errorMessage={error}
				value={name}
			/>

			<div className="absolute bottom-0 left-0 mt-auto flex w-full gap-2 bg-neutral-900 p-6">
				<Button disabled={isUploading || isEditing} type="submit">
					{isUploading ? "上傳中..." : isEditing ? "編輯中..." : "編輯群組"}
				</Button>
			</div>
		</form>
	);
}
