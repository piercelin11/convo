import pool from "@/config/database.js";
import { hashPassword } from "@/utils/password.utils.js";

async function seedUser() {
	const client = await pool.connect();
	const users = [
		{
			username: "Alice",
			email: "alice@example.com",
			password: "password123",
			age: 30,
		},
		{
			username: "Bob",
			email: "bob@example.com",
			password: "password123",
			age: 28,
		},
		{
			username: "Charlie",
			email: "charlie@example.com",
			password: "password123",
			age: 35,
		},
	];
	console.info("[seedUser]: 開始填充種子使用者資料");
	try {
		await client.query("BEGIN");
		for (const user of users) {
			const { username, email, password, age } = user;
			const hashedPassword = hashPassword(password);

			await client.query(
				`INSERT INTO users (username, email, password_hash, age) 
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) DO NOTHING;`,
				[username, email, hashedPassword, age]
			);
		}
		await client.query("COMMIT");
		console.info("[seedUser]: 種子使用者資料填充成功");
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("[seedUser]: 填充種子使用者時發生錯誤", error);
	} finally {
		client.release();
		pool.end();
		console.info("[seedUser]: 腳本結束並將 'client' 釋放回資料庫池中");
	}
}

try {
	await seedUser();
} catch (error) {
	console.error("[seedUser]: 填充種子使用者時發生未預期錯誤", error);
	process.exit(1);
}
