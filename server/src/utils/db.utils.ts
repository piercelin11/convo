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

/**
 * 通用資料庫查詢函式。
 * 執行單條 SQL 查詢，並提供統一的錯誤處理機制，特別是針對網路或資料庫連線問題。
 *
 * @template T - 期望從查詢結果行中返回的數據類型。
 * @param query - 要執行的 SQL 查詢字串。
 * @param values - 綁定到 SQL 查詢中的參數值陣列。
 * @returns 包含查詢結果的 Promise。
 * @throws {DatabaseError} 如果資料庫查詢失敗，會根據錯誤類型拋出操作性或非操作性的 DatabaseError。
 */
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

/**
 * 通用資料庫事務函式。
 * 在單一原子操作中執行一系列資料庫查詢。如果事務中的任何操作失敗，所有變更都會被回滾。
 * 提供統一的錯誤處理，特別是針對事務過程中的連線問題。
 *
 * @template T - 事務回調函式成功時預期返回的數據類型。
 * @param callback - 一個非同步函式，接收一個 `PoolClient` 物件，用於執行事務內的查詢。
 * @returns 事務成功時，回調函式返回的結果。
 * @throws {DatabaseError} 如果資料庫事務失敗，會根據錯誤類型拋出操作性或非操作性的 DatabaseError。
 */
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
