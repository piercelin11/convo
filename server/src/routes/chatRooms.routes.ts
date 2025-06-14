import {
	createChatRoomHandler,
	deleteChatRoomHandler,
	editChatRoomHandler,
	getChatRoomHandler,
	getChatRoomsHandler,
} from "@/controllers/chatRooms.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import {
	ChatRoomParamsSchema,
	CreateChatRoomSchema,
	EditChatRoomSchema,
} from "@convo/shared";
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
	validateRequest({ body: CreateChatRoomSchema }),
	createChatRoomHandler
);

router.delete(
	"/:roomId",
	validateRequest({ params: ChatRoomParamsSchema }),
	deleteChatRoomHandler
);

router.put(
	"/group",
	validateRequest({ body: EditChatRoomSchema }),
	editChatRoomHandler
);

export default router;
