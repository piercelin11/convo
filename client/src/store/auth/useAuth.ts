import { useContext } from "react";
import AuthContext from "./AuthContext";

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("[useAuth]必須於 Provider 包裹的元件內使用");
	}

	return context;
}

export function useSession() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("[useSession]必須於 Provider 包裹的元件內使用");
	}
	const { user } = context;
	if (!user) {
		throw new Error("使用者尚未登入");
	}

	return user;
}
