/* eslint-disable @typescript-eslint/no-explicit-any */

import pool from "@/config/database.js";
import { DatabaseError } from "./error.utils.js";
import { PoolClient, QueryResult, QueryResultRow } from "pg";

const NETWORK_ERROR_CODES = [
	"ENOTFOUND",
	"ECONNREFUSED",
	"EHOSTUNREACH",
	"ETIMEDOUT",
];

export async function dbQuery<T extends QueryResultRow>(
	query: string,
	values: any[]
): Promise<QueryResult<T>> {
	try {
		const result = await pool.query<T>(query, values);
		return result;
	} catch (error) {
		console.error(`[dbQuery] 資料庫查詢時發生錯誤: SQL: "${query}"`, error);
		if (
			error instanceof Error &&
			"code" in error &&
			typeof error.code === "string" &&
			NETWORK_ERROR_CODES.includes(error.code)
		) {
			console.error("[dbQuery] 偵測到網路或資料庫連線問題");
			throw new DatabaseError(`資料庫連線錯誤，請檢查網路或服務狀態`, true, {
				cause: error,
			});
		}
		throw new DatabaseError("資料庫操作失敗", false, {
			cause: error,
		});
	}
}

export async function dbTransaction<T>(
	callback: (client: PoolClient) => Promise<T>
): Promise<T> {
	let client: PoolClient | null = null;
	try {
		client = await pool.connect();
		client.query("BEGIN");
		const result = await callback(client);
		await client.query("COMMIT");
		return result;
	} catch (error) {
		if (client) {
			await client.query("ROLLBACK");
		}
		console.error(`[dbTransaction] 資料庫交易時發生錯誤:`, error);
		if (
			error instanceof Error &&
			"code" in error &&
			typeof error.code === "string" &&
			NETWORK_ERROR_CODES.includes(error.code)
		) {
			throw new DatabaseError(`資料庫連線錯誤，交易已回滾`, true, {
				cause: error,
			});
		}
		throw new DatabaseError(`資料庫交易失敗，已回滾`, false, {
			cause: error,
		});
	} finally {
		if (client) {
			client.release();
		}
	}
}
