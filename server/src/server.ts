import express from "express";
import cors from "cors";
import authRouter from "@/routes/auth.routes.js";
import messagesRouter from "@/routes/messages.routes.js";
import chatRoomsRouter from "@/routes/chatRooms.routes.js";
import friendshipsRouter from "@/routes/friendships.routes.js";
import uploadRouter from "@/routes/upload.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import authenticateToken from "./middlewares/authenticateToken.js";
import userRouter from "@/routes/user.route.js";
import initializeWebSocket from "./websocket/index.js";
import { wss } from "./websocket/wss.js";
import pool from "./config/database.js";

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
app.use("/api/friendships", authenticateToken, friendshipsRouter);
app.use("/api/users", authenticateToken, userRouter);
app.use("/api/upload", authenticateToken, uploadRouter);
app.use("/api/messages", authenticateToken, messagesRouter);

app.use(errorHandler);

const server = app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});

initializeWebSocket(server);

function gracefulShutdown() {
	console.info("收到 SIGINT 訊號，正在優雅地關閉伺服器...");
	wss.close(() => {
		console.info("WebSocket 伺服器已關閉。");
		server.close(() => {
			console.info("HTTP 伺服器已關閉。");
			pool.end(() => {
				console.info("資料庫連線池已關閉。");
				process.exit(0);
			});
		});
	});

	setTimeout(() => {
		console.error("無法在時限內優雅地關閉，將強制退出。");
		process.exit(1);
	}, 10000);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
