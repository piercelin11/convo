import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import axiosClient from "@/api/client";
import { editProfileSchema } from "@convo/shared";
import z from "zod/v4";
import ResponseMessage from "../ui/ResponseMessage";
import axios from "axios";

type FormErrorsType = {
	username?: string;
	age?: string;
};

export default function ProfileModal() {
	const [formInput, setFormInput] = useState({
		username: "",
		age: "",
	});

	function formInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.name;
		const value = e.target.value;
		setFormInput((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	const [errors, setErrors] = useState<FormErrorsType>({});
	const [errorText, setErrorText] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		setErrors({});
		setErrorText("");

		try {
			const validated = editProfileSchema.safeParse(formInput);

			if (!validated.success) {
				const formattedErrors = z.flattenError(validated.error).fieldErrors;
				setErrors({
					username: formattedErrors.username?.[0],
					age: formattedErrors.age?.[0],
				});
				return;
			}

			await axiosClient.patch("/users/profile", {
				username: validated.data?.username,
				age: validated.data?.age?.toString(),
			});
		} catch (error) {
			console.error("個資表單資料傳送錯誤", error);

			// 從瀏覽器請求失敗的錯誤訊息
			if (axios.isAxiosError(error) && error.response) {
				setErrorText(error.response?.data.message);
			} else {
				setErrorText("個資表單發送出現未預期錯誤");
			}
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
				<ResponseMessage type="error" message={errorText} />
				<div className="flex gap-10 pt-10">
					<Button>cancel</Button>
					<Button type="submit">submit</Button>
				</div>
			</form>
		</div>
	);
}
