import express from "express";
import cors from "cors";
import authRouter from "@/routes/auth.routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.use("/api/auth", authRouter);

app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});
