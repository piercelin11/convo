import { useAuth } from "@/store/auth/useAuth";
import { Outlet } from "react-router-dom";

export default function PrivateRoute() {
	const { isAuthenticated, expiredAt, logout } = useAuth();

	const isExpired = expiredAt ? Date.now() > expiredAt * 1000 : true;

	if (!isAuthenticated || isExpired) logout();
	return <Outlet />;
}
