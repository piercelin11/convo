import { env } from "@/config/env.js";
import { UserPayloadType } from "@/middlewares/authenticateToken.js";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "./index.js";

/**
 * 用於生成 JWT 的使用者資料型別。
 * @property id - 用戶的唯一識別碼。
 * @property username - 用戶名稱。
 * @property email - 用戶的電子郵件。
 */
type UserTokenData = {
	id: string;
	username: string;
	email: string;
};

/**
 * 為指定的使用者資料生成一個 JSON Web Token (JWT)。
 * 該令牌包含使用者ID、使用者名稱和電子郵件，並設定1天的過期時間。
 * 同時會解析生成的令牌以獲取其 Payload 資訊。
 *
 * @param user - 包含使用者ID、使用者名稱和電子郵件的物件，用於簽署JWT。
 * @returns 包含生成的 JWT 字串 (`token`) 和解析後的使用者 JWT Payload (`userJWTPayload`) 的物件。
 */
export function generateAuthToken(user: UserTokenData) {
	const token = jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		env.JWT_PRIVATE_KEY,
		{ expiresIn: "1d" }
	);

	const userJWTPayload = jwt.decode(token) as UserPayloadType;

	return { token, userJWTPayload };
}

export function authenticateAuthToken(token?: string) {
	if (!token) {
		throw new AuthenticationError("未授權的請求");
	}
	try {
		const userPayload = jwt.verify(
			token,
			env.JWT_PRIVATE_KEY
		) as UserPayloadType;

		return userPayload;
	} catch (error) {
		console.error("使用者身份驗證失敗:", error);
		throw new AuthenticationError("未授權的請求");
	}
}
