import {
	acceptRequestHandler,
	blockUserHandler,
	cancelRequestHandler,
	getFriendshipsHandler,
	getRequestHandler,
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
