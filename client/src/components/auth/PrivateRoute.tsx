import { useAuth } from "@/store/auth/useAuth";
import { Outlet } from "react-router-dom";

export default function PrivateRoute() {
	const { isAuthenticated, logout } = useAuth();

	if (!isAuthenticated) logout();
	return <Outlet />;
}
