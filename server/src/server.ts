import express from "express";
import cors from "cors";
import authRouter from "@/routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

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

app.use(errorHandler);

app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});
