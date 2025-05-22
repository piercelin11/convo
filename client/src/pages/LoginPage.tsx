import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";

export default function LoginPage() {
	return (
		<div className="m-auto w-2/3 max-w-[500px] space-y-14">
			<div>
				<h2 className="text-center">Welcome back</h2>
				<p className="text-description text-center">
					Enter your name and password to log in.
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
