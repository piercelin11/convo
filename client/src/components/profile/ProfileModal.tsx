import { useRef, useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import Modal from "../ui/Modal";

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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		// 必須為整數，十進制
		const parsedAge = parseInt(age, 10);

		let isValid = true;

		// 使用者名稱驗證
		if (!username.trim()) {
			setUsernameError("使用者名稱不能為空");
			isValid = false;
		} else if (username.trim().length < 3) {
			setUsernameError("使用者名稱至少需要 3 個字元");
			isValid = false;
		} else if (username.trim().length > 20) {
			setUsernameError("使用者名稱不能超過 20 個字元");
			isValid = false;
		} else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
			setUsernameError("使用者名稱只能包含英文字母、數字和底線");
			isValid = false;
		} else {
			setUsernameError(null); // 清除錯誤訊息
		}

		// 年齡驗證
		if (!age.trim()) {
			setAgeError("年齡不能為空");
			isValid = false;
		} else if (isNaN(parsedAge)) {
			setAgeError("年齡必須是數字");
			isValid = false;
		} else if (!Number.isInteger(parsedAge)) {
			setAgeError("年齡必須是整數");
			isValid = false;
		} else if (parsedAge < 0) {
			setAgeError("年齡不能小於 0");
			isValid = false;
		} else {
			setAgeError(null); // 清除錯誤訊息
		}

		if (isValid) {
			console.info(username, parsedAge);
			setAge("");
			setUsername("");
		}
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
						<FormInput
							id="age"
							name="Age"
							label="Age"
							value={age}
							onChange={handleAgeChange}
						/>
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
