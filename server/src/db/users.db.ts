import pool from "@/config/database.js";
import { DatabaseError } from "@/utils/error.utils.js";
import { UserRecord } from "@convo/shared";

/**
 * 透過使用者名稱獲取唯一使用者資料
 * @param username - 使用者名稱。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserByUsername(
	username: string
): Promise<UserRecord> {
	const query = `SELECT * FROM users WHERE username = $1`;
	const values = [username];

	try {
		const result = await pool.query(query, values);
		const user: UserRecord = result.rows[0];

		return user;
	} catch (error) {
		console.error(
			`[db]: 獲取使用者名稱為 ${username} 的資料時發生錯誤:`,
			error
		);
		throw new DatabaseError(
			`獲取使用者名稱為 ${username} 的資料時發生錯誤`,
			false,
			{ cause: error }
		);
	}
}

/**
 * 透過電子郵件獲取唯一使用者資料
 * @param email - 電子郵件。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserByEmail(email: string): Promise<UserRecord> {
	const query = `SELECT * FROM users WHERE email = $1`;
	const values = [email];

	try {
		const result = await pool.query(query, values);
		const user: UserRecord = result.rows[0];

		return user;
	} catch (error) {
		console.error(
			`[db]: 獲取電子郵件為 ${email} 的使用者資料時發生錯誤:`,
			error
		);
		throw new DatabaseError(
			`獲取電子郵件為 ${email} 的使用者資料時發生錯誤`,
			false,
			{ cause: error }
		);
	}
}

/**
 * 透過 id 獲取唯一使用者資料
 * @param id - 使用者 id。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserById(id: string): Promise<UserRecord> {
	const query = `SELECT * FROM users WHERE id = $1`;
	const values = [id];

	try {
		const result = await pool.query(query, values);
		const user: UserRecord = result.rows[0];

		return user;
	} catch (error) {
		console.error(`[db]: 獲取 id 為 ${id} 的使用者資料時發生錯誤:`, error);
		throw new DatabaseError(`獲取 id 為 ${id} 的使用者資料時發生錯誤`, false, {
			cause: error,
		});
	}
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
	const query = `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`;
	const values = [username, email, password];

	try {
		const result = await pool.query(query, values);
		const user: UserRecord = result.rows[0];

		return user;
	} catch (error) {
		console.error(`[db]: 輸入使用者 ${username} 資料時發生錯誤:`, error);
		throw new DatabaseError(`輸入使用者 ${username} 資料時發生錯誤`, false, {
			cause: error,
		});
	}
}
