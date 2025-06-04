import { chatRoomsService } from "@/api/api";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import ResponseMessage from "@/components/ui/ResponseMessage";
import { useSession } from "@/store/auth/useAuth";
import {
	createGroupChatSchema,
	type CreateGroupChatSchemaType,
	type FriendshipDto,
} from "@convo/shared";
import { AxiosError } from "axios";
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
	const selectedFriendIds = selectedFriends.map((friend) => friend.id);
	const [loading, setLoading] = useState(false);
	const [formInput, setFormInput] = useState<CreateGroupChatSchemaType>({
		name: "",
		members: selectedFriendIds,
	});
	const [error, setError] = useState<string | null>(null);
	const [apiError, setApiError] = useState<string | null>(null);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormInput((prev) => ({
			...prev,
			name: e.target.value,
		}));
	}

	function handleXClick(id: string) {
		const newSelectedFriends = selectedFriends.filter(
			(friend) => friend.id !== id
		);
		setSelectedFriends(newSelectedFriends);
		setFormInput((prev) => ({
			...prev,
			member: newSelectedFriends.map((friend) => friend.id),
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		try {
			const validated = createGroupChatSchema.safeParse(formInput);

			if (!validated.success) {
				const formErrors = z.flattenError(validated.error).fieldErrors;
				setError(formErrors.name ? formErrors.name[0] : null);
				setApiError(null);
				return;
			} else {
				setError(null);
			}

			await chatRoomsService.createGroupChat({
				name: formInput.name,
				members: [...formInput.members, user.id],
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error("[登入]登入過程出現問題", error.response);
				setApiError(error.response?.data.message);
			} else {
				console.error("[登入]登入過程出現未預期的問題:", error);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<h1>Create Group</h1>
			<form className="flex h-full flex-col space-y-5" onSubmit={handleSubmit}>
				<FormInput
					id="group-name"
					name="group"
					label="Group name"
					type="text"
					placeholder="eg: Convo"
					onChange={handleInputChange}
					errorMessage={error}
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
				{apiError && <ResponseMessage message={apiError} type="error" />}
				<div className="mt-auto flex gap-2">
					<Button
						className="bg-neutral-800 text-neutral-400"
						onClick={prevStep}
						disabled={loading}
					>
						Previous Step
					</Button>
					<Button disabled={loading} type="submit">
						Create Room
					</Button>
				</div>
			</form>
		</>
	);
}
