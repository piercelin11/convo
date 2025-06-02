import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { loginSchema, registerSchema } from "@convo/shared";
import { handleLogin, handleRegister } from "@/controllers/auth.controller.js";

const router = Router();

router.post("/login", validateRequest({ body: loginSchema }), handleLogin);

router.post(
	"/register",
	validateRequest({ body: registerSchema }),
	handleRegister
);

export default router;
