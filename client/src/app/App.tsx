import routes from "@/config/routes";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

function App() {
	const element = useRoutes(routes);
	return <Suspense fallback={"頁面載入中⋯⋯"}>{element}</Suspense>;
}

export default App;
