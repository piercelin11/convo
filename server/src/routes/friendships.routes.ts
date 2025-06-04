import { handleGetFriendships } from "@/controllers/friendships.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", handleGetFriendships);

export default router;
