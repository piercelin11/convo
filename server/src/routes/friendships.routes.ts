import { getFriendshipsHandler } from "@/controllers/friendships.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", getFriendshipsHandler);

export default router;
