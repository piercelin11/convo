/* eslint-disable jsdoc/require-jsdoc */
import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	console.log("正在執行 UP 遷移：為 chat_rooms 新增 image_url 欄位...");

	// 使用 pgm.addColumn 為 'chat_rooms' 表新增一個名為 'image_url' 的欄位
	pgm.addColumn("chat_rooms", {
		image_url: {
			type: "text",
			notNull: false,
		},
	});

	console.log("image_url 欄位已成功新增到 chat_rooms。");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	console.log("正在執行 DOWN 遷移：從 chat_rooms 移除 image_url 欄位...");

	// 使用 pgm.dropColumn 來移除 'image_url' 欄位
	pgm.dropColumn("chat_rooms", "image_url");

	console.log("image_url 欄位已成功移除。");
}
