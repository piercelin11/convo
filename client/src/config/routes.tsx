import ChatPage from "@/pages/ChatPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import type { RouteObject } from "react-router-dom";

const routesConfig: RouteObject[] = [
	{
		path: "/",
		element: <ChatPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
];

export default routesConfig;