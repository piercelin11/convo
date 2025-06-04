import {
	handleCreateGroupChat,
	handleUsersChatRoom,
} from "@/controllers/chatRooms.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { createGroupChatSchema } from "@convo/shared";
import { Router } from "express";

const router = Router();

router.get("/", handleUsersChatRoom);

router.post(
	"/group",
	validateRequest({ body: createGroupChatSchema }),
	handleCreateGroupChat
);

export default router;
