import { env } from "@/config/env.js";
import * as userDb from "@/db/user.db.js";
import { UserPayloadType } from "@/middlewares/authenticateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function authenticateUserLogin(
	username: string,
	password: string
) {
	const user = await userDb.findUserByUsername(username);
	if (!user) throw new Error("帳號或密碼不正確");
	const passwordIsMatched = await bcrypt.compare(password, user.password_hash);
	if (!passwordIsMatched) throw new Error("帳號或密碼不正確");

	const token = jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		env.JWT_PRIVATE_KEY,
		{ expiresIn: "1d" }
	);

	const userJWTPayload = jwt.decode(token) as UserPayloadType;

	return { user, token, userJWTPayload };
}
