import * as userDb from "@/db/user.db.js";
import {
	AuthenticationError,
	generateAuthToken,
	hashPassword,
} from "@/utils/index.js";
import bcrypt from "bcryptjs";

export async function loginUser(username: string, password: string) {
	const user = await userDb.findUserByUsername(username);
	if (!user) throw new AuthenticationError("帳號或密碼不正確");
	const passwordIsMatched = await bcrypt.compare(password, user.password_hash);
	if (!passwordIsMatched || !user)
		throw new AuthenticationError("帳號或密碼不正確");

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

export async function registerUser(
	username: string,
	email: string,
	password: string
) {
	const existedUsername = await userDb.findUserByUsername(username);
	if (existedUsername) throw new AuthenticationError("使用者名稱已存在。");
	const existedEmail = await userDb.findUserByEmail(email);
	if (existedEmail) throw new AuthenticationError("電子郵件已存在。");

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

export async function getUserSession(id: string) {
	const user = await userDb.findUserById(id);
	const userDTO = {
		id: user.id,
		username: user.username,
		email: user.email,
		age: user.age,
		avatar_url: user.avatar_url,
	};
	return userDTO;
}
