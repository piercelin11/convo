import { authService } from "@/api";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import ResponseMessage from "@/components/ui/ResponseMessage";
import { useAuth } from "@/store/auth/useAuth";
import { RegisterSchema, type RegisterSchemaType } from "@convo/shared";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod/v4";

const defaultError = {
	username: undefined,
	email: undefined,
	password: undefined,
	comfirmPassword: undefined,
};

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [formInput, setFormInput] = useState<RegisterSchemaType>({
		username: "",
		email: "",
		password: "",
		comfirmPassword: "",
	});
	const [errors, setErrors] =
		useState<Partial<RegisterSchemaType>>(defaultError);
	const [apiError, setApiError] = useState<string | null>(null);
	const { login } = useAuth();

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.name;
		const value = e.target.value;
		setFormInput((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		try {
			const validated = RegisterSchema.safeParse(formInput);

			if (!validated.success) {
				const formErrors = z.flattenError(validated.error).fieldErrors;
				setErrors({
					username: formErrors.username && formErrors.username[0],
					password: formErrors.password && formErrors.password[0],
					email: formErrors.email && formErrors.email[0],
					comfirmPassword:
						formErrors.comfirmPassword && formErrors.comfirmPassword[0],
				});
				setApiError(null);
				return;
			} else {
				setErrors(defaultError);
			}

			const result = await authService.register(validated.data);

			if (result.user) {
				login(result.user);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error("[註冊]註冊過程出現問題", error.response);
				setApiError(error.response?.data.message);
			} else {
				console.error("[註冊]註冊過程出現未預期的問題:", error);
			}
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="m-auto w-2/3 max-w-[500px] space-y-14">
			<div>
				<h1 className="text-title text-center">註冊帳戶並開始聊天</h1>
				<p className="text-description text-center">
					輸入名稱、電子信箱以及密碼，開始與人線上聊天吧
				</p>
			</div>
			<form className="space-y-6" onSubmit={handleSubmit}>
				<FormInput
					id="username"
					name="username"
					label="使用者名稱"
					placeholder="eg. John"
					onChange={handleInputChange}
					errorMessage={errors.username}
				/>
				<FormInput
					id="email"
					name="email"
					label="電子信箱"
					placeholder="eg. john1234@gmail.com"
					onChange={handleInputChange}
					errorMessage={errors.email}
				/>
				<FormInput
					id="password"
					name="password"
					label="密碼"
					type="password"
					placeholder="輸入你的密碼"
					onChange={handleInputChange}
					errorMessage={errors.password}
				/>
				<FormInput
					id="comfirmPassword"
					name="comfirmPassword"
					label="確認密碼"
					type="password"
					placeholder="再輸入一次密碼"
					onChange={handleInputChange}
					errorMessage={errors.comfirmPassword}
				/>
				<Button type="submit" disabled={loading}>
					註冊
				</Button>
				{apiError && <ResponseMessage type="error" message={apiError} />}
				<p className="text-center text-sm text-neutral-400">
					已經有帳號了？
					<Link to={"/login"}>
						<span className="hover:text-neutral-100 hover:underline">
							點擊登入
						</span>
					</Link>
				</p>
			</form>
		</div>
	);
}
