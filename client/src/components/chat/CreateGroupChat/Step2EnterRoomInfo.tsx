import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import ResponseMessage from "@/components/ui/ResponseMessage";
import UploadFileInput from "@/components/ui/UploadImgInput";
import useCreateRoomMutation from "@/queries/chat/useCreateRoomMutation";
import useUploadImgMutation from "@/queries/upload/useUploadImgMutation";
import { useSession } from "@/store/auth/useAuth";
import useModalContext from "@/store/modal/useModalContext";
import { CreateChatRoomSchema, type FriendshipDto } from "@convo/shared";
import { useState } from "react";
import { X } from "react-feather";
import z from "zod/v4";

type Step2EnterRoomInfoProps = {
	selectedFriends: FriendshipDto[];
	setSelectedFriends: React.Dispatch<React.SetStateAction<FriendshipDto[]>>;
	prevStep: () => void;
};

export default function Step2EnterRoomInfo({
	selectedFriends,
	setSelectedFriends,
	prevStep,
}: Step2EnterRoomInfoProps) {
	const user = useSession();
	const { setModalKey } = useModalContext();
	const selectedFriendIds = selectedFriends.map((friend) => friend.id);
	const [name, setName] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	function handleXClick(id: string) {
		const newSelectedFriends = selectedFriends.filter(
			(friend) => friend.id !== id
		);
		setSelectedFriends(newSelectedFriends);
	}

	const {
		mutateAsync: createGroup,
		error: mutationError,
		isPending: isCreating,
	} = useCreateRoomMutation();
	const { mutateAsync: uploadRoomImg, isPending: isUploading } =
		useUploadImgMutation();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let imageUrl: string | null = null;

		if (file) {
			imageUrl = await uploadRoomImg({ file, s3KeyPrefix: "chat-room" });
		}

		const roomData = {
			name,
			members: [...selectedFriendIds, user.id],
			img: imageUrl,
		};

		const validated = CreateChatRoomSchema.safeParse(roomData);
		if (!validated.success) {
			const fieldErrors = z.flattenError(validated.error).fieldErrors;
			setError(fieldErrors.name ? fieldErrors.name[0] : null);
			return;
		} else {
			setError(null);
		}

		const result = await createGroup(validated.data);
		if (result) setModalKey(null);
	}

	return (
		<form
			className="flex h-full flex-col space-y-5 pb-26"
			onSubmit={handleSubmit}
		>
			<UploadFileInput setFile={setFile} />
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
			<div className="flex flex-wrap gap-2">
				<div className="flex items-center gap-1 rounded-full border border-neutral-700 px-2 py-1">
					<Avatar src={user.avatar_url} size={30} />
					<p className="me-2 text-sm text-neutral-400">{user.username}</p>
				</div>
				{selectedFriends.map((friend) => (
					<div
						key={friend.id}
						className="flex items-center gap-1 rounded-full border border-neutral-700 px-2 py-1"
					>
						<Avatar src={friend.avatar_url} size={30} />
						<p className="me-2 text-sm text-neutral-400">{friend.username}</p>
						<X
							size={14}
							className="text-neutral-500 hover:text-neutral-100"
							onClick={() => handleXClick(friend.id)}
						/>
					</div>
				))}
			</div>
			{mutationError?.response && (
				<ResponseMessage
					message={mutationError.response.data.message}
					type="error"
				/>
			)}
			<div className="absolute bottom-0 left-0 mt-auto flex w-full gap-2 bg-neutral-900 p-6">
				<Button
					className="bg-neutral-800 text-neutral-400"
					onClick={prevStep}
					disabled={isCreating || isUploading}
				>
					{isUploading
						? "上傳圖片中..."
						: isCreating
							? "建立群組中..."
							: "上一步"}
				</Button>
				<Button disabled={isCreating || isUploading} type="submit">
					{isUploading
						? "上傳圖片中..."
						: isCreating
							? "建立群組中..."
							: "建立群組"}
				</Button>
			</div>
		</form>
	);
}
