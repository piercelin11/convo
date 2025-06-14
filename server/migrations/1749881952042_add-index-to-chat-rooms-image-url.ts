/* eslint-disable jsdoc/require-jsdoc */
import { MigrationBuilder } from "node-pg-migrate";

const INDEX_NAME = "idx_chat_rooms_image_url";
const TABLE_NAME = "chat_rooms";
const COLUMN_NAME = "image_url";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createIndex(TABLE_NAME, COLUMN_NAME, {
		name: INDEX_NAME,
		unique: false,
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropIndex(TABLE_NAME, COLUMN_NAME, {
		name: INDEX_NAME,
	});
}
