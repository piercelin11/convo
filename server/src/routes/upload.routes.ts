import {
	ImgUploadHandler,
	deleteImgHandler,
} from "@/controllers/upload.controller.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import { UploadImgSchema, DeleteImgSchema } from "@convo/shared";
import { Router } from "express";

const router = Router();

router.post(
	"/presigned-url",
	validateRequest({ body: UploadImgSchema }),
	ImgUploadHandler
);

router.delete(
	"/:objectKey",
	validateRequest({ params: DeleteImgSchema }),
	deleteImgHandler
);

export default router;
