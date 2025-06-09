import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import type React from "react";
import { useState } from "react";
import { LoginSchema, type LoginSchemaType } from "@convo/shared";
import { AxiosError } from "axios";
import { authService } from "@/api";
import { useAuth } from "@/store/auth/useAuth";
import ResponseMessage from "@/components/ui/ResponseMessage";
import z from "zod/v4";
import { Link } from "react-router-dom";

const defaultError = {
	username: undefined,
	password: undefined,
};

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [formInput, setFormInput] = useState<LoginSchemaType>({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<LoginSchemaType>>(defaultError);
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
			const validated = LoginSchema.safeParse(formInput);

			if (!validated.success) {
				const formErrors = z.flattenError(validated.error).fieldErrors;
				setErrors({
					username: formErrors.username && formErrors.username[0],
					password: formErrors.password && formErrors.password[0],
				});
				setApiError(null);
				return;
			} else {
				setErrors(defaultError);
			}

			const result = await authService.login(validated.data);

			if (result.data) {
				login(result.data);
			}
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
		<div className="m-auto w-2/3 max-w-[500px] space-y-14">
			<div>
				<h1 className="text-title text-center">歡迎回來</h1>
				<p className="text-description text-center">
					輸入使用者名稱與密碼並登入帳號吧
				</p>
			</div>
			<form className="space-y-6" onSubmit={handleSubmit}>
				<FormInput
					id="username"
					name="username"
					label="使用者名稱"
					placeholder="eg. John"
					onChange={handleInputChange}
					value={formInput.username}
					errorMessage={errors.username}
				/>
				<FormInput
					id="password"
					name="password"
					label="密碼"
					placeholder="Enter your password"
					onChange={handleInputChange}
					value={formInput.password}
					errorMessage={errors.password}
				/>
				<Button type="submit" disabled={loading}>
					{loading ? "登入中..." : "登入"}
				</Button>
				{apiError && <ResponseMessage type="error" message={apiError} />}
				<p className="text-center text-sm text-neutral-400">
					尚未有帳號？
					<Link to={"/register"}>
						<span className="hover:text-neutral-100 hover:underline">
							點擊註冊
						</span>
					</Link>
				</p>
			</form>
		</div>
	);
}
