import {
	createChatRoomHandler,
	deleteChatRoomHandler,
	getChatRoomHandler,
	getChatRoomsHandler,
} from "@/controllers/chatRooms.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { ChatRoomParamsSchema, CreateGroupChatSchema } from "@convo/shared";
import { Router } from "express";

const router = Router();

router.get("/", getChatRoomsHandler);

router.get(
	"/:roomId",
	validateRequest({ params: ChatRoomParamsSchema }),
	getChatRoomHandler
);

router.post(
	"/group",
	validateRequest({ body: CreateGroupChatSchema }),
	createChatRoomHandler
);

router.delete(
	"/:roomId",
	validateRequest({ params: ChatRoomParamsSchema }),
	deleteChatRoomHandler
);

export default router;
