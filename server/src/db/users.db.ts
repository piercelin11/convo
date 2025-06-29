import { dbQuery } from "@/utils/db.utils.js";
import { UserRecord, UserRecordSchema } from "@convo/shared";

/**
 * 透過使用者名稱獲取唯一使用者資料
 * @param username - 使用者名稱。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserByUsername(
	username: string
): Promise<UserRecord | undefined> {
	const query = `SELECT * FROM users WHERE username = $1`;
	const values = [username];

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.optional().parse(user);
}

/**
 * 透過電子郵件獲取唯一使用者資料
 * @param email - 電子郵件。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserByEmail(email: string): Promise<UserRecord> {
	const query = `SELECT * FROM users WHERE email = $1`;
	const values = [email];

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.parse(user);
}

/**
 * 透過 id 獲取唯一使用者資料
 * @param id - 使用者 id。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserById(id: string): Promise<UserRecord> {
	const query = `SELECT * FROM users WHERE id = $1`;
	const values = [id];

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.parse(user);
}

/**
 * 輸入使用者資料
 * @param username - 使用者名稱。**必填**。
 * @param email - 電子郵件。**必填**。
 * @param password - 加密過後的密碼。**必填**。
 * @returns 輸入成功後回傳的的使用者資料。
 */
export async function createUser(
	username: string,
	email: string,
	password: string
): Promise<UserRecord> {
	const query = `
		INSERT INTO users (username, email, password_hash) 
		VALUES ($1, $2, $3) RETURNING *`;
	const values = [username, email, password];

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.parse(user);
}
