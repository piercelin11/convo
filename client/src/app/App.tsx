import routes from "@/config/routes";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import GlobalModals from "./GlobalModals";

function App() {
	const element = useRoutes(routes);
	return (
		<Suspense fallback={"頁面載入中⋯⋯"}>
			{element}
			<GlobalModals />
		</Suspense>
	);
}

export default App;
