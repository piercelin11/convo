import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { EditProfileSchema } from "@convo/shared";
import z from "zod/v4";
import ResponseMessage from "../ui/ResponseMessage";
import useProfileMutation from "@/queries/user/useProfileMutation";

type FormErrorsType = {
	username?: string;
	age?: string;
};

export default function ProfileModal() {
	const [formInput, setFormInput] = useState({
		username: "",
		age: "",
	});

	const [errors, setErrors] = useState<FormErrorsType>({});

	function formInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.name;
		const value = e.target.value;
		setFormInput((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	const { mutateAsync, error } = useProfileMutation();

	const handleSubmit = async (event: React.FormEvent) => {
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		setErrors({});

		try {
			const validated = EditProfileSchema.safeParse(formInput);

			if (!validated.success) {
				const formattedErrors = z.flattenError(validated.error).fieldErrors;
				setErrors({
					username: formattedErrors.username?.[0],
					age: formattedErrors.age?.[0],
				});
				return;
			}

			await mutateAsync(validated.data);
			setFormInput({ username: "", age: "" });
		} catch (error) {
			console.error("個資表單資料傳送錯誤", error);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4">
					<FormInput
						id="username"
						name="username"
						label="Username"
						value={formInput.username}
						onChange={formInputChange}
						errorMessage={errors.username}
					/>

					<FormInput
						id="age"
						name="age"
						label="Age"
						value={formInput.age?.toString()}
						onChange={formInputChange}
						errorMessage={errors.age?.toString()}
					/>
				</div>
				{error?.response && (
					<ResponseMessage type="error" message={error.response.data.message} />
				)}
				<div className="flex gap-10 pt-10">
					<Button>cancel</Button>
					<Button type="submit">submit</Button>
				</div>
			</form>
		</div>
	);
}
