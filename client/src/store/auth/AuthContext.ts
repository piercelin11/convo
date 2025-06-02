import type { UserDTO } from "@convo/shared";
import { createContext } from "react";

type AuthContextType = {
	isAuthenticated: boolean;
	user: UserDTO | null;
	token: string | null;
	expiredAt: number | null;
	isLoadong: boolean;
	login: (user: UserDTO, token: string, expiredAt: number) => void;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
