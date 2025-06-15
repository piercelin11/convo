import * as userDb from "@/db/users.db.js";
import {
	AuthenticationError,
	generateAuthToken,
	hashPassword,
	NotFoundError,
} from "@/utils/index.js";
import bcrypt from "bcryptjs";

/**
 * 驗證使用者登入憑證並生成認證令牌。
 *
 * @param username - 欲登入的使用者名稱。
 * @param password - 使用者提供的密碼。
 * @returns 包含使用者數據傳輸物件 (DTO) 和認證令牌的物件。
 * @throws {AuthenticationError} 如果帳號或密碼不正確。
 */
export async function loginUser(username: string, password: string) {
	const user = await userDb.findUserByUsername(username);
	if (!user) throw new AuthenticationError("帳號或密碼不正確");
	const passwordIsMatched = await bcrypt.compare(password, user.password_hash);
	if (!passwordIsMatched || !user)
		// user 已經在上面檢查過，這裡的 !user 是冗餘的
		throw new AuthenticationError("帳號或密碼不正確");

	const userDTO = {
		id: user.id,
		username: user.username,
		email: user.email,
		age: user.age,
		avatar_url: user.avatar_url,
	};

	const { token } = generateAuthToken(user); // 假設 generateAuthToken 接收 user record

	return { user: userDTO, token };
}

/**
 * 註冊新使用者。
 *
 * @param username - 欲註冊的使用者名稱。
 * @param email - 欲註冊的電子郵件地址。
 * @param password - 使用者設定的密碼。
 * @returns 包含新註冊使用者數據傳輸物件 (DTO) 和認證令牌的物件。
 * @throws {AuthenticationError} 如果使用者名稱或電子郵件已存在。
 */
export async function registerUser(
	username: string,
	email: string,
	password: string
) {
	const existedUsername = await userDb.findUserByUsername(username);
	if (existedUsername) throw new AuthenticationError("使用者名稱已存在。");
	const existedEmail = await userDb.findUserByEmail(email);
	if (existedEmail) throw new AuthenticationError("電子郵件已存在。");

	// 假設 createUser 返回完整的 user record
	const user = await userDb.createUser(username, email, hashPassword(password));

	const userDTO = {
		id: user.id,
		username: user.username,
		email: user.email,
		age: user.age,
		avatar_url: user.avatar_url,
	};

	const { token } = generateAuthToken(user);

	return { user: userDTO, token };
}

/**
 * 根據使用者ID獲取使用者會話資訊。
 *
 * @param id - 用戶的唯一識別碼 (UUID)。
 * @returns 包含使用者數據傳輸物件 (DTO) 的物件。
 */
export async function getUserSession(id: string) {
	const user = await userDb.findUserById(id);
	if (!user) throw new NotFoundError("使用者不存在");

	const userDTO = {
		id: user.id,
		username: user.username,
		email: user.email,
		age: user.age,
		avatar_url: user.avatar_url,
	};
	return userDTO;
}
