import React from "react";
import type { RouteObject } from "react-router-dom";

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const ChatRoomPage = React.lazy(() => import("@/pages/ChatRoomPage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/pages/RegisterPage"));
const AuthLayout = React.lazy(() => import("@/components/layouts/AuthLayout"));

const routesConfig: RouteObject[] = [
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/:chatRoomId",
		element: <ChatRoomPage />,
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
