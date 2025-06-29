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
import cookie from "cookie";
import { WebSocket, WebSocketServer } from "ws";

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
app.use("/api/upload", authenticateToken, uploadRouter);
app.use("/api/messages", authenticateToken, messagesRouter);

app.use(errorHandler);

const server = app.listen(port, () => {
	console.info(`Server running on port ${port}.`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket, req) => {
	console.info("一個新的客戶端已透過 WebSocket 成功連接");
	const cookieString = req.headers.cookie || "";
	const cookies = cookie.parse(cookieString);
	ws.on("message", (message) => {
		console.log(message.toString());
	});
});
