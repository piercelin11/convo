import { Router } from "express";
import { editProfileSchema, EditProfileSchemaType } from "@convo/shared";
import { validateRequest } from "@/middlewares/validateRequest.js";
import pool from "@/config/database.js";

const router = Router();

router.patch(
	"/profile",
	validateRequest({ body: editProfileSchema }),
	async (req, res) => {
		try {
			const { username, age } = req.body as EditProfileSchemaType;

			// 找出使用者
			const userId = req.user?.id;

			// 確認使用者姓名勿重複
			const checkUsernameSql =
				"SELECT id FROM users WHERE username =$1 AND id != $2";
			const existingUser = await pool.query(checkUsernameSql, [
				username,
				userId,
			]);

			if (existingUser.rows.length > 0) {
				res.status(409).json({
					success: false,
					message: "此使用者名稱已被使用，請更換一個。",
				});
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

			if (updateUserResult.rows.length === 0) {
				res.status(404).json({
					success: false,
					message: "找不到指定的使用者。",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "使用者資料已更新",
				data: updateUserResult.rows[0],
			});
		} catch (error) {
			console.error("更新使用者資料時發生未預期的錯誤:", error);

			res.status(500).json({
				success: false,
				message: "伺服器內部錯誤，請稍後再試。",
			});
		}
	}
);

export default router;
