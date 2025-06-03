import { handleUsersChatRoom } from "@/controllers/chatRooms.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", handleUsersChatRoom);

export default router;
