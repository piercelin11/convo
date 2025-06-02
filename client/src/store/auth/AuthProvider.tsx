import type { UserDTO } from "@convo/shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [expiredAt, setExpiredAt] = useState<number | null>(null);
	const [isLoadong, setIsLoadong] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		try {
			const storedToken = localStorage.getItem("authToken");
			const storedUserJSON = localStorage.getItem("user");
			const storedExpiredAtString = localStorage.getItem("expiredAt");

			if (storedToken && storedUserJSON && storedExpiredAtString) {
				const storedUser = JSON.parse(storedUserJSON) as UserDTO;
				const storedExpiredAt = parseInt(storedExpiredAtString);
				setUser(storedUser);
				setToken(storedToken);
				setExpiredAt(storedExpiredAt);
				setIsAuthenticated(true);
			}
		} catch (error) {
			console.error(
				"[AuthContext]: 從 localStorage 初始化身份驗證資訊失敗:",
				error
			);
			localStorage.removeItem("authToken");
			localStorage.removeItem("user");
			localStorage.removeItem("expiredAt");
		} finally {
			setIsLoadong(false);
		}
	}, []);

	function login(user: UserDTO, token: string, expiredAt: number) {
		localStorage.setItem("authToken", token);
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("expiredAt", expiredAt.toString());

		setUser(user);
		setToken(token);
		setExpiredAt(expiredAt);
		setIsAuthenticated(true);

		navigate("/");
	}

	function logout() {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		localStorage.removeItem("expiredAt");

		setUser(null);
		setToken(null);
		setExpiredAt(null);
		setIsAuthenticated(false);

		navigate("/login");
	}

	if (isLoadong) return <p>身份驗證中⋯⋯</p>;

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				token,
				user,
				expiredAt,
				isLoadong,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
