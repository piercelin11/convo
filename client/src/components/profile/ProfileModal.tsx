import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";

import axiosClient from "@/api/client";

export default function ProfileModal() {
	const [username, setUsername] = useState<string>("");
	const [age, setAge] = useState<string>("");
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [ageError, setAgeError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const data = await axiosClient.patch("/users/profile", {
			username: username,
			age: age,
		});

		console.log(data);
	};

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAge(event.target.value);
	};

	return (
		<div>
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
					<Button>cancel</Button>
					<Button type="submit">submit</Button>
				</div>
			</form>
		</div>
	);
}
