import pool from "@/config/database.js";
import { UserRecord } from "@convo/shared";

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
		throw error;
	}
}
