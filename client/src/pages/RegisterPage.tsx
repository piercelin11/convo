import Button from "@/components/shared/button/Button";
import FormInput from "@/components/shared/form/FormInput";

export default function RegisterPage() {
	return (
		<div className="m-auto w-2/3 max-w-[500px] space-y-14">
			<div>
				<h2 className="text-center">Sign Up And Chat</h2>
				<p className="text-description text-center">
					Enter your name, password, and email to sign up and chat.
				</p>
			</div>
			<form className="space-y-6">
				<FormInput
					id="username"
					name="username"
					label="username"
					placeholder="eg. John"
				/>
				<FormInput
					id="email"
					name="email"
					label="email"
					placeholder="eg. john1234@gmail.com"
				/>
				<FormInput
					id="password"
					name="password"
					label="password"
					placeholder="Enter your password"
				/>
				<Button type="submit">Log In</Button>
			</form>
		</div>
	);
}
