import { Router } from "express";
import { editProfileSchema, EditProfileSchemaType } from "@convo/shared";
import { validateRequest } from "@/middlewares/validateRequest.js";
import pool from "@/config/database.js";
import { success } from "zod/v4";

const router = Router();

router.patch(
	"/profile",
	validateRequest({ body: editProfileSchema }),
	async (req, res) => {
		try {
			const { username, age } = req.body as EditProfileSchemaType;

			// 找出使用者
			const userId = req.user?.id;
			const userChcekSql = "SELECT * FROM users Where id = $1";
			const userResult = await pool.query(userChcekSql, [userId]);

			if (userResult.rows.length === 0) {
				console.error(`使用者${userId}不存在。`);
				return;
			}

			// 更新使用者資料
			const updateUserSql =
				"UPDATE users SET username = $1,age = $2 WHERE id = $3 RETURNING *";
			const updateUserResult = await pool.query(updateUserSql, [
				username,
				age,
				userId,
			]);

			console.log(
				"使用 pool query 更新後的使用者資訊:",
				updateUserResult.rows[0]
			);

			res.status(200).json({
				success: true,
				message: "使用者資料已更新",
				data: updateUserResult.rows[0],
			});
		} catch (error) {
			console.error("使用 pool query 執行更新資訊出錯:", error);
			throw error;
		}
	}
);

export default router;
