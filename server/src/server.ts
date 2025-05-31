import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});
