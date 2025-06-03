import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { loginSchema, registerSchema } from "@convo/shared";
import {
	handleSession,
	handleLogin,
	handleLogout,
	handleRegister,
} from "@/controllers/auth.controller.js";
import authenticateToken from "@/middlewares/authenticateToken.js";

const router = Router();

router.post("/login", validateRequest({ body: loginSchema }), handleLogin);

router.post(
	"/register",
	validateRequest({ body: registerSchema }),
	handleRegister
);

router.post("/logout", handleLogout);

router.get("/session", authenticateToken, handleSession);

export default router;
