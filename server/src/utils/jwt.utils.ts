import { env } from "@/config/env.js";
import { UserPayloadType } from "@/middlewares/authenticateToken.js";
import jwt from "jsonwebtoken";

type UserTokenData = {
	id: string;
	username: string;
	email: string;
};

export function generateAuthToken(user: UserTokenData) {
	const token = jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		env.JWT_PRIVATE_KEY,
		{ expiresIn: "1d" }
	);

	const userJWTPayload = jwt.decode(token) as UserPayloadType;

	return { token, userJWTPayload };
}
