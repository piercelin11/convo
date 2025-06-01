import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
	const token = localStorage.getItem("authToken");
	const expiredAt = Number(localStorage.getItem("expiredAt")) * 1000;

	const isExpired = !isNaN(expiredAt) ? Date.now() > expiredAt : true;

	if (!token || isExpired) {
		localStorage.removeItem("authToken");
		localStorage.removeItem("expiredAt");
		return <Navigate to={"/login"} replace />;
	}

	return <Outlet />;
}
