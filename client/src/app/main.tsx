import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/store/auth/AuthProvider.tsx";
import ModalProvider from "@/store/modal/ModalProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import WebSocketProvider from "@/store/webSocket/WebSocketProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<ModalProvider>
						<WebSocketProvider>
							<App />
							<ReactQueryDevtools initialIsOpen={false} />
						</WebSocketProvider>
					</ModalProvider>
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
