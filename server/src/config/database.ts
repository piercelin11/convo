import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

const databaseUrl = env.DATABASE_URL;

const pool = new Pool({
	connectionString: databaseUrl,
});

// 監聽連線池的 'connect' 事件，當有新的客戶端成功連接時觸發
pool.on("connect", () => {
	console.info("資料庫連線池：一個新的客戶端已連接");
});

// 監聽連線池的 'error' 事件，處理閒置客戶端發生的錯誤
pool.on("error", (err) => {
	console.error("[資料庫]資料庫連線池發生未預期的錯誤 (閒置客戶端錯誤):", err);
});

console.info("PostgreSQL 連線池已設定完成。");

export default pool;

// 建立一個函式來測試資料庫連線，可以在伺服器啟動時呼叫
export async function testDbConnection(): Promise<void> {
	let client;

	try {
		console.info("正在嘗試從連線池獲取客戶端並測試資料庫連線...");
		client = await pool.connect();
		const result = await client.query("SELECT NOW() AS now");
		console.info("資料庫連線測試成功！ Neon DB 目前時間:", result.rows[0].now);
	} catch (err) {
		console.error("[資料庫]資料庫連線測試失敗:", err);
	} finally {
		if (client) {
			client.release();
			console.info("測試客戶端已釋放回連線池。");
		}
	}
}
