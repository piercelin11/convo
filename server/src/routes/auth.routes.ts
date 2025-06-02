import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { loginSchema } from "@convo/shared";
import handleLoginasync from "@/controllers/auth.controller.js";

const router = Router();

router.post("/login", validateRequest({ body: loginSchema }), handleLoginasync);

export default router;
