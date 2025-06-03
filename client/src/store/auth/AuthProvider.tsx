import type { UserDTO } from "@convo/shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { authService } from "@/api/api";
import { AxiosError } from "axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [isLoadong, setIsLoadong] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		async function checkUserSession() {
			try {
				const response = await authService.authenticateUser();

				if (response.success && response.user) {
					setUser(response.user);
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
		navigate("/");
	}

	async function logout() {
		await authService.logout();
		setUser(null);
		setIsAuthenticated(false);
		navigate("/login");
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
