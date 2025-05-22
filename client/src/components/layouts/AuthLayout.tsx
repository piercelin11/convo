import { Outlet } from "react-router-dom";

export default function AuthLayout() {
	return (
		<div className="flex h-dvh">
			<div className="h-full flex-1/2 p-4">
				<div className="bg-auth h-full w-full rounded-2xl" />
			</div>
			<div className="flex flex-1/2">
				<Outlet />
			</div>
		</div>
	);
}
