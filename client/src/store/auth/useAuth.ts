import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("[useAuth]必須於 Provider 包裹的元件內使用");
	}

	return context;
}
