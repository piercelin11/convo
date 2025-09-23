/* eslint-disable jsdoc/require-jsdoc */
import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

const NOTIFICATION_TYPE_NAME = "notification_type";

export async function up(pgm: MigrationBuilder): Promise<void> {
	console.log("正在執行 UP 遷移：建立 notifications 相關資源...");

	// 步驟 1: 建立 ENUM 型別
	// 這個動作必須在建立使用該型別的資料表之前
	console.log(`正在建立 ENUM 型別: ${NOTIFICATION_TYPE_NAME}...`);
	pgm.createType(NOTIFICATION_TYPE_NAME, [
		"FRIEND_REQUEST",
		"SYSTEM_ANNOUNCEMENT", // 為了未來擴展，可以先加入其他可能類型
	]);

	// 步驟 2: 建立 notifications 資料表，並使用我們剛建立的 ENUM 型別
	console.log("正在建立 notifications 資料表...");
	pgm.createTable("notifications", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("gen_random_uuid()"),
		},
		recipient_id: {
			type: "uuid",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		// 使用我們自訂的 ENUM 型別
		type: { type: NOTIFICATION_TYPE_NAME, notNull: true },
		is_read: { type: "boolean", notNull: true, default: false },
		data: { type: "jsonb" },
		created_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});

	// 步驟 3: 建立索引
	console.log("正在為 notifications 資料表建立索引...");
	pgm.createIndex("notifications", "recipient_id");
	pgm.createIndex("notifications", ["recipient_id", "is_read"]);

	console.log("UP 遷移執行完畢。");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	console.log("正在執行 DOWN 遷移：移除 notifications 相關資源...");

	// 撤銷的順序通常與建立時相反

	// 步驟 1: 刪除索引 (雖然 dropTable 會自動刪除，但明確寫出更清晰)
	// pgm.dropIndex(...) // 實際上 dropTable 會處理，所以這步可以省略

	// 步驟 2: 刪除 notifications 資料表
	console.log("正在刪除 notifications 資料表...");
	pgm.dropTable("notifications", { ifExists: true });

	// 步驟 3: 刪除 ENUM 型別
	// 這個動作必須在所有使用該型別的資料表都被刪除之後
	console.log(`正在刪除 ENUM 型別: ${NOTIFICATION_TYPE_NAME}...`);
	pgm.dropType(NOTIFICATION_TYPE_NAME, { ifExists: true });

	console.log("DOWN 遷移執行完畢。");
}
