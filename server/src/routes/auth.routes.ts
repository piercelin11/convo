import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { LoginSchema, RegisterSchema } from "@convo/shared";
import {
	getUserSessionHandler,
	loginHandler,
	logoutHandler,
	registerHandler,
} from "@/controllers/auth.controller.js";
import authenticateToken from "@/middlewares/authenticateToken.js";

const router = Router();

router.post("/login", validateRequest({ body: LoginSchema }), loginHandler);

router.post(
	"/register",
	validateRequest({ body: RegisterSchema }),
	registerHandler
);

router.post("/logout", logoutHandler);

router.get("/session", authenticateToken, getUserSessionHandler);

export default router;
