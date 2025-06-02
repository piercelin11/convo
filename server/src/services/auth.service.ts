import { env } from "@/config/env.js";
import * as userDb from "@/db/user.db.js";
import { UserPayloadType } from "@/middlewares/authenticateToken.js";
import { AuthenticationError } from "@/utils/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function authenticateUserLogin(
	username: string,
	password: string
) {
	const user = await userDb.findUserByUsername(username);
	if (!user) throw new AuthenticationError("帳號或密碼不正確");
	const passwordIsMatched = await bcrypt.compare(password, user.password_hash);
	if (!passwordIsMatched || !user)
		throw new AuthenticationError("帳號或密碼不正確");

	const token = jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		env.JWT_PRIVATE_KEY,
		{ expiresIn: "1d" }
	);

	const userJWTPayload = jwt.decode(token) as UserPayloadType;

	return { user, token, userJWTPayload };
}
