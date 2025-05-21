import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.get("/test/get-data", (req, res) => {
	res.json({
		id: "this-is-a-test",
		message: "Welcome to Convo! This message is fetch from our backend!",
	});
});

app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});
