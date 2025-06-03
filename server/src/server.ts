import express from "express";
import cors from "cors";
import authRouter from "@/routes/auth.routes.js";
import chatRoomsRouter from "@/routes/chatRooms.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import authenticateToken from "./middlewares/authenticateToken.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api/auth", authRouter);
app.use("/api/chat-rooms", authenticateToken, chatRoomsRouter);

app.use(errorHandler);

app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});
