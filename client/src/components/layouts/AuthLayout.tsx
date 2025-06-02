import { useAuth } from "@/store/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
	const { isAuthenticated } = useAuth();
	if (isAuthenticated) return <Navigate to={"/"} replace />;
	return (
		<div className="flex h-dvh flex-col md:flex-row">
			<div className="h-full flex-1/5 p-4 md:flex-1/2">
				<div className="bg-auth h-full w-full rounded-2xl" />
			</div>
			<div className="flex h-full flex-1/2">
				<Outlet />
			</div>
		</div>
	);
}
