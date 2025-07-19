/* eslint-disable jsdoc/require-jsdoc */
import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	console.log("正在執行 UP 遷移：為 room_members 新增 last_read_at 欄位...");
	pgm.addColumn("room_members", {
		last_read_at: {
			type: "timestamptz",
			notNull: false,
		},
	});
	console.log("last_read_at 欄位已成功新增。");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	console.log("正在執行 DOWN 遷移：從 room_members 移除 last_read_at 欄位...");
	pgm.dropColumn("room_members", "last_read_at");
}
