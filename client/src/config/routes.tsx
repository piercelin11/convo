import React from "react";
import type { RouteObject } from "react-router-dom";

const AuthLayout = React.lazy(() => import("@/components/layouts/AuthLayout"));
const ChatPage = React.lazy(() => import("@/pages/ChatPage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/pages/RegisterPage"));

const routesConfig: RouteObject[] = [
	{
		path: "/",
		element: <ChatPage />,
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: "/register",
				element: <RegisterPage />,
			},
			{
				path: "/login",
				element: <LoginPage />,
			},
		],
	},
];

export default routesConfig;
