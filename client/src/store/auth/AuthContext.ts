import type { UserDTO } from "@convo/shared";
import { createContext } from "react";

type AuthContextType = {
	isAuthenticated: boolean;
	user: UserDTO | null;
	isLoadong: boolean;
	login: (user: UserDTO) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
