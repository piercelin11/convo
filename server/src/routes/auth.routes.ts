import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { loginSchema } from "@convo/shared";
import { handleLogin } from "@/controllers/auth.controller.js";

const router = Router();

router.post("/login", validateRequest({ body: loginSchema }), handleLogin);

export default router;
