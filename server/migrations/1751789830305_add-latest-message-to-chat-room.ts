/* eslint-disable jsdoc/require-jsdoc */

import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	console.log(
		"正在執行 UP 遷移：為 chat_rooms 新增 latest_message_* 相關欄位..."
	);

	// 使用 pgm.addColumns 為 'chat_rooms' 表一次新增多個欄位
	// 注意：addColumn (單數) 和 addColumns (複數) 的參數格式不同
	pgm.addColumns("chat_rooms", {
		latest_message_content: {
			type: "text",
			notNull: false, // 允許為 NULL，因為新建立的房間沒有訊息
		},
		latest_message_at: {
			type: "timestamptz", // 使用帶時區的時間戳
			notNull: false, // 允許為 NULL
		},
		latest_message_sender_id: {
			type: "uuid",
			notNull: false, // 允許為 NULL
			references: "users(id)", // 設定外鍵，參考到 users 表
			onDelete: "SET NULL", // 如果訊息發送者被刪除，將此欄位設為 NULL
		},
	});

	console.log("欄位已成功新增。");

	// 為 latest_message_at 欄位建立索引，以加速聊天室列表的排序效能
	console.log("正在為 latest_message_at 欄位建立索引...");
	pgm.createIndex("chat_rooms", "latest_message_at");

	console.log("UP 遷移執行完畢。");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	console.log(
		"正在執行 DOWN 遷移：從 chat_rooms 移除 latest_message_* 相關欄位..."
	);

	// 移除為 latest_message_at 建立的索引
	pgm.dropIndex("chat_rooms", "latest_message_at");

	// 使用 pgm.dropColumns 一次移除多個欄位
	pgm.dropColumns("chat_rooms", [
		"latest_message_content",
		"latest_message_at",
		"latest_message_sender_id",
	]);

	console.log("DOWN 遷移執行完畢。");
}
