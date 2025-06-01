import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import type React from "react";
import { useState } from "react";
import { loginSchema, type LoginSchemaType } from "@convo/shared";
import { AxiosError } from "axios";
import { authService } from "@/api/api";

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [formInput, setFormInput] = useState<LoginSchemaType>({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<LoginSchemaType>>({
		username: undefined,
		password: undefined,
	});
	const [apiError, setApiError] = useState<string | null>(null);

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
			const validated = loginSchema.safeParse(formInput);
			if (!validated.success) {
				const formErrors = validated.error.flatten().fieldErrors;
				setErrors({
					username: formErrors.username && formErrors.username[0],
					password: formErrors.password && formErrors.password[0],
				});
				return;
			}
			const result = await authService.login(validated.data);
			if (result.token) localStorage.setItem("authToken", result.token);
			if (result.user)
				localStorage.setItem("user", JSON.stringify(result.user));
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error("[登入]登入過程出現問題", error.response);
				setApiError(error.response?.data.message);
			} else console.error("[登入]登入過程出現未預期的問題:", error);
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="m-auto w-2/3 max-w-[500px] space-y-14">
			<div>
				<h1 className="text-title text-center">Welcome back</h1>
				<p className="text-description text-center">
					Enter your name and password to log in.
				</p>
			</div>
			<form className="space-y-6" onSubmit={handleSubmit}>
				<FormInput
					id="username"
					name="username"
					label="username"
					placeholder="eg. John"
					onChange={handleInputChange}
					value={formInput.username}
					errorMessage={errors.username}
				/>
				<FormInput
					id="password"
					name="password"
					label="password"
					placeholder="Enter your password"
					onChange={handleInputChange}
					value={formInput.password}
					errorMessage={errors.password}
				/>
				<Button type="submit" disabled={loading}>
					{loading ? "Loading..." : "Log In"}
				</Button>
				{apiError && <p className="text-danger">{apiError}</p>}
			</form>
		</div>
	);
}
