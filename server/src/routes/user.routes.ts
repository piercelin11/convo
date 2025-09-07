import { Router } from "express";
import {
	EditProfileSchema,
	GetUserSchema,
	SearchUserSchema,
} from "@convo/shared";
import { validateRequest } from "@/middlewares/validateRequest.js";
import {
	editUserHandler,
	getUserHandler,
	searchUsers,
} from "@/controllers/user.controller.js";

const router = Router();

router.patch(
	"/profile",
	validateRequest({ body: EditProfileSchema }),
	editUserHandler
);
router.get(
	"/search",
	// validateRequest({ query: SearchUserSchema }),
	searchUsers
);

router.get(
	"/:userId",
	validateRequest({ params: GetUserSchema }),
	getUserHandler
);

export default router;
