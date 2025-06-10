import {
	createGroupChatHandler,
	getChatRoomHandler,
	getChatRoomsHandler,
} from "@/controllers/chatRooms.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { CreateGroupChatSchema } from "@convo/shared";
import { Router } from "express";

const router = Router();

router.get("/", getChatRoomsHandler);

router.get("/:roomId", getChatRoomHandler);

router.post(
	"/group",
	validateRequest({ body: CreateGroupChatSchema }),
	createGroupChatHandler
);

export default router;
