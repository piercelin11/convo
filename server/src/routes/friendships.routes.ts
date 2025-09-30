import {
	acceptRequestHandler,
	blockUserHandler,
	cancelRequestHandler,
	getFriendshipsHandler,
	getRequestHandler,
	rejectRequestHandler,
	searchRequestHandlers,
	sentRequestHandler,
} from "@/controllers/friendships.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import {
	requesterSchema,
	SearchFriendRequestsSchema,
	targetUserSchema,
} from "@convo/shared";
import { ta } from "zod/v4/locales";
import { rejectFriendshipRequest } from "@/services/friendship.service.js";

const router = Router();

router.get("/", getFriendshipsHandler);

router.post(
	"/send-request",
	validateRequest({
		body: targetUserSchema,
	}),
	sentRequestHandler
);

router.post(
	"/accept-request",
	validateRequest({ body: requesterSchema }),
	acceptRequestHandler
);

router.delete(
	"/reject-request",
	validateRequest({ body: targetUserSchema }),
	rejectRequestHandler
);

router.delete(
	"/cancel-request",
	validateRequest({ body: targetUserSchema }),
	cancelRequestHandler
);

router.post(
	"/block-user",
	validateRequest({ body: targetUserSchema }),
	blockUserHandler
);

router.get("/requests", getRequestHandler);

router.get(
	"/requests/search",
	// validateRequest({ query: SearchFriendRequestsSchema }),
	searchRequestHandlers
);

export default router;
