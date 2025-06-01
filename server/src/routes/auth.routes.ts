import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { LoginResponseType, loginSchema, UserRecord } from "@convo/shared";
import pool from "@/config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";

const router = Router();

router.post(
	"/login",
	validateRequest({ body: loginSchema }),
	async (req, res) => {
		const { username, password } = req.body;
		let response: LoginResponseType;
		try {
			const query = `SELECT * FROM users WHERE username = $1`;
			const values = [username];
			const result = await pool.query(query, values);
			const user: UserRecord = result.rows[0];
			if (!user) {
				response = {
					success: false,
					message: "Wrong username.",
				};
				res.status(400).json(response);
				return;
			}
			const passwordIsMatched = await bcrypt.compare(
				password,
				user.password_hash
			);

			if (!passwordIsMatched) {
				response = {
					success: false,
					message: "Wrong password.",
				};
				res.status(400).json(response);
				return;
			}

			const token = jwt.sign(
				{ id: user.id, username: user.username, email: user.email },
				env.JWT_PRIVATE_KEY,
				{ expiresIn: "1d", algorithm: "HS256" }
			);

			response = {
				success: true,
				message: "Successfully log in.",
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					age: user.age,
					avatar_url: user.avatar_url,
				},
				token,
			};
			res.status(200).json(response);
		} catch (error) {
			console.error(error);
		}
	}
);

export default router;
