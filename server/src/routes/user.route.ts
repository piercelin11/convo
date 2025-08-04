import { Router } from "express";
import { EditProfileSchema, GetUserSchema } from "@convo/shared";
import { validateRequest } from "@/middlewares/validateRequest.js";
import {
	editUserHandler,
	getUserHandler,
} from "@/controllers/user.controller.js";

const router = Router();

router.patch(
	"/profile",
	validateRequest({ body: EditProfileSchema }),
	editUserHandler
);

router.get(
	"/:userId",
	validateRequest({ params: GetUserSchema }),
	getUserHandler
);

export default router;
