import type { UserDTO } from "@convo/shared";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { authService } from "@/api";
import { AxiosError } from "axios";
import { useLogout } from "@/queries/auth/useLogout";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [isLoadong, setIsLoadong] = useState(true);

	const { mutate } = useLogout();

	useEffect(() => {
		async function checkUserSession() {
			try {
				const response = await authService.getSession();

				if (response.success && response.data) {
					setUser(response.data);
					setIsAuthenticated(true);
				}
			} catch (error) {
				if (error instanceof AxiosError && error.status === 403) {
					console.warn("請重新登入");
				} else console.error("[AuthContext]發生未預期錯誤:", error);

				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setIsLoadong(false);
			}
		}
		checkUserSession();
	}, []);

	function login(user: UserDTO) {
		setUser(user);
		setIsAuthenticated(true);
	}

	function logout() {
		mutate();
		setUser(null);
		setIsAuthenticated(false);
	}

	if (isLoadong) return <p>身份驗證中⋯⋯</p>;

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				isLoadong,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
