import PrivateRoute from "@/components/auth/PrivateRoute";
import ChatLayout from "@/components/layouts/ChatLayout";
import React from "react";
import type { RouteObject } from "react-router-dom";

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const ChatRoomPage = React.lazy(() => import("@/pages/ChatRoomPage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/pages/RegisterPage"));
const AuthLayout = React.lazy(() => import("@/components/layouts/AuthLayout"));

const routesConfig: RouteObject[] = [
	{
		element: <PrivateRoute />,
		children: [
			{
				element: <ChatLayout />,
				children: [
					{
						path: "/",
						element: <HomePage />,
					},
					{
						path: "/:roomId",
						element: <ChatRoomPage />,
					},
				],
			},
		],
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
