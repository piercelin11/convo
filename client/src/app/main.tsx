import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/store/auth/AuthProvider.tsx";
import ModalProvider from "@/store/modal/ModalProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ModalProvider>
				<AuthProvider>
					<App />
				</AuthProvider>
			</ModalProvider>
		</BrowserRouter>
	</StrictMode>
);
