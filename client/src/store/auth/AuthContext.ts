import type { UserDTO } from "@convo/shared";
import { createContext } from "react";

type AuthContextType = {
	isAuthenticated: boolean;
	user: UserDTO | null;
	isLoadong: boolean;
	login: (user: UserDTO) => void;
	logout: () => void;
};

export const authContext = createContext<AuthContextType | undefined>(
	undefined
);
