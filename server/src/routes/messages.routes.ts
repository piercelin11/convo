import { getMessagesHandler } from "@/controllers/messages.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { ChatRoomParamsSchema } from "@convo/shared";
import { Router } from "express";

const router = Router();

router.get(
	"/:roomId",
	validateRequest({ params: ChatRoomParamsSchema }),
	getMessagesHandler
);

export default router;
