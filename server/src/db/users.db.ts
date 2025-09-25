import pool from "@/config/database.js";
import { dbQuery } from "@/utils/db.utils.js";
import {
	UserRecord,
	UserRecordSchema,
	UserSchema,
	UserSchemaType,
} from "@convo/shared";

/**
 * 透過使用者名稱獲取唯一使用者資料
 * @param username - 使用者名稱。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserByUsername(
	username: string,
	options?: { excludeUserId?: string }
): Promise<UserRecord | undefined> {
	const queryParts = [`SELECT * FROM users WHERE username = $1`];
	const values: unknown[] = [username];

	// 如果提供了 excludeUserId，則動態加入條件
	if (options?.excludeUserId) {
		queryParts.push(`AND id != $${values.length + 1}`);
		values.push(options.excludeUserId);
	}

	const query = queryParts.join(" ");

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.optional().parse(user);
}

/**
 * 透過電子郵件獲取唯一使用者資料
 * @param email - 電子郵件。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserByEmail(
	email: string
): Promise<UserRecord | undefined> {
	const query = `SELECT * FROM users WHERE email = $1`;
	const values = [email];

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.optional().parse(user);
}

/**
 * 透過 id 獲取唯一使用者資料
 * @param id - 使用者 id。**必填**。
 * @returns 唯一使用者資料。
 */
export async function findUserById(
	id: string
): Promise<UserRecord | undefined> {
	const query = `SELECT * FROM users WHERE id = $1`;
	const values = [id];

	const result = await dbQuery<UserRecord>(query, values);
	const user = result.rows[0];

	return UserRecordSchema.optional().parse(user);
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

/**
 * 根據使用者 ID 更新其個人資料
 * @param userId - 要更新的使用者 ID
 * @param username - 新的使用者名稱
 * @param age - 新的年齡
 * @returns 回傳更新後完整的使用者資料，若找不到使用者則為 undefined
 */

export async function updateUser(
	userId: string,
	username: string,
	age: number
): Promise<UserRecord | undefined> {
	const sql =
		"UPDATE users SET username = $1, age = $2 WHERE id = $3 RETURNING *";
	const result = await pool.query<UserRecord>(sql, [username, age, userId]);
	return result.rows[0];
}

export async function searchUsersByUsername(
	query: string,
	currentUserId?: string
): Promise<UserSchemaType[]> {
	const searchTerm = `%${query}%`;
	const client = await pool.connect();
	try {
		const queryText = `
		SELECT
			u.id,
			u.username,
			u.email,
			u.avatar_url,
			f.status as friendship_status
		FROM users u
		LEFT JOIN friendships f ON (
			(f.requester_id = $2 AND f.addressee_id = u.id)
			OR
			(f.addressee_id = $2 AND f.requester_id = u.id)
		)
		WHERE u.username ILIKE $1
			AND ($2 IS NULL OR u.id != $2)
		ORDER BY u.username ASC
		LIMIT 10;
		`;
		const { rows } = await client.query(queryText, [searchTerm, currentUserId]);
		// 驗證返回的資料符合 UserSchema，包含 friendship_status
		return UserSchema.array().parse(rows);
	} catch (err) {
		console.error(err);
		throw err; // 重新拋出錯誤，讓上層處理
	} finally {
		client.release();
	}
}
