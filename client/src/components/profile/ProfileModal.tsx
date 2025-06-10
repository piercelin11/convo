import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import Modal from "../ui/Modal";
import { assert } from "console";
import axiosClient from "@/api/client";

type ProfileModalProps = {
	closeHandler?: () => void;
	isOpen: boolean;
};

export default function ProfileModal({
	closeHandler,
	isOpen,
}: ProfileModalProps) {
	const [username, setUsername] = useState<string>("");
	const [age, setAge] = useState<string>("");
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [ageError, setAgeError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const data = await axiosClient.post("/api/users", {
			username: username,
			age: age,
		});
	};

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAge(event.target.value);
	};

	return (
		<div>
			<Modal closeHandler={closeHandler} isOpen={isOpen}>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-4">
						<FormInput
							id="username"
							name="Username"
							label="Username"
							value={username}
							onChange={handleUsernameChange}
						/>
						<p>{usernameError}</p>
						<FormInput
							id="age"
							name="Age"
							label="Age"
							value={age}
							onChange={handleAgeChange}
						/>
						<p>{ageError}</p>
					</div>
					<div className="flex gap-10 pt-10">
						<Button onClick={closeHandler}>cancel</Button>
						<Button type="submit">submit</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
