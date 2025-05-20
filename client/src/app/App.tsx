import { useEffect, useState } from "react";

function App() {
	// eslint-disable-next-line
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("http://localhost:3000/test/get-data");
				if (!response.ok) {
					throw new Error(
						`HTTP 錯誤！ 狀態: ${response.status} - ${response.statusText}`
					);
				}
				const result = await response.json();
				setData(result.message);
			} catch (error) {
				console.error(error);
			}
		}

		fetchData();
	}, []);

	return (
		<div className="flex h-screen w-screen">
			<div className="m-auto text-center">
				<h1 className="text-xl font-bold">Convo</h1>
				<p>{data}</p>
			</div>
		</div>
	);
}

export default App;
