import { chatRoomsImageUploadHandler } from "@/controllers/upload.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { UploadSchema } from "@convo/shared";
import { Router } from "express";

const router = Router();

router.post(
	"/presigned-url/room-image",
	validateRequest({ body: UploadSchema }),
	chatRoomsImageUploadHandler
);

export default router;
