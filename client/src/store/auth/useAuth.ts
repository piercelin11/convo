import { useContext } from "react";
import { authContext } from "./authContext";

export function useAuth() {
	const context = useContext(authContext);

	if (!context) {
		throw new Error("[useAuth]必須於 Provider 包裹的元件內使用");
	}

	return context;
}

export function useSession() {
	const context = useContext(authContext);

	if (!context) {
		throw new Error("[useSession]必須於 Provider 包裹的元件內使用");
	}
	const { user } = context;
	if (!user) {
		throw new Error("使用者尚未登入");
	}

	return user;
}
