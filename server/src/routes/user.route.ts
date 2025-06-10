import { Router } from "express";
import { editProfileSchema, EditProfileSchemaType } from "@convo/shared";
import { validateRequest } from "@/middlewares/validateRequest.js";
import pool from "@/config/database.js";

const router = Router();

router.post(
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
				console.log(`使用者${userId}不存在。`);
				return null;
			}

			// 更新使用者資料
			const updateUserSql =
				"UPDATE users SET username = $1 age = $2 WHERE id = $3 RETURNING *";
			const updateUserResult = await pool.query(updateUserSql, [
				username,
				age,
				userId,
			]);

			console.log(
				"使用 pool query 更新後的使用者資訊:",
				updateUserResult.rows[0]
			);

			return updateUserResult.rows[0];
		} catch (error) {
			console.error("使用 pool query 執行更新資訊出錯:", error);
			throw error;
		}
	}
);

export default router;
