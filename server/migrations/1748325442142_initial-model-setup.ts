/* eslint-disable jsdoc/require-jsdoc */
import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

// 向上遷移：建立資料表和索引
export async function up(pgm: MigrationBuilder): Promise<void> {
	// 1. 建立 users (使用者) 資料表
	pgm.createTable("users", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("gen_random_uuid()"),
		},
		username: { type: "varchar(50)", notNull: true, unique: true },
		email: { type: "varchar(255)", notNull: true, unique: true },
		password_hash: { type: "varchar(255)", notNull: true },
		age: { type: "integer", notNull: false }, // 可為空
		avatar_url: { type: "text", notNull: false }, // 可為空
		created_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
		updated_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});
	// 為 email 和 username 建立索引 (雖然 UNIQUE 約束通常會隱含索引，但明確建立有好處)
	pgm.createIndex("users", "email");
	//  pgm.createIndex('users', 'username'); // username 已經有 UNIQUE 了，通常也會自動建索引

	// 2. 建立 user_preferences (使用者偏好設定) 資料表
	pgm.createTable("user_preferences", {
		user_id: {
			type: "uuid",
			primaryKey: true, // user_id 是主鍵，也是外鍵
			references: "users(id)", // 參考到 users 資料表的 id 欄位
			onDelete: "CASCADE", // 如果 users 表中的使用者被刪除，相關的偏好設定也一併刪除
		},
		theme: { type: "varchar(20)", notNull: true, default: "'light'" }, // 字串預設值需要引號
		notifications_enabled: { type: "boolean", notNull: true, default: true },
		updated_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});

	// 3. 建立 chat_rooms (聊天室) 資料表
	pgm.createTable("chat_rooms", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("gen_random_uuid()"),
		},
		name: { type: "varchar(100)", notNull: false }, // 私訊聊天室名稱可為空
		type: { type: "varchar(20)", notNull: true }, // 例如 'direct' 或 'group'
		creator_id: {
			type: "uuid",
			notNull: false, // 私訊或系統建立的房間可能沒有建立者
			references: "users(id)",
			onDelete: "SET NULL", // 如果建立者帳號被刪除，將此欄位設為 NULL
		},
		created_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
		updated_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});
	pgm.createIndex("chat_rooms", "creator_id"); // 為 creator_id 建立索引

	// 4. 建立 friendships (好友關係) 資料表
	pgm.createTable(
		"friendships",
		{
			// 注意：複合主鍵和 CHECK 約束會在 table options 中定義，或使用 pgm.addConstraint
			requester_id: {
				type: "uuid",
				notNull: true,
				references: "users(id)",
				onDelete: "CASCADE",
			},
			addressee_id: {
				type: "uuid",
				notNull: true,
				references: "users(id)",
				onDelete: "CASCADE",
			},
			status: { type: "varchar(20)", notNull: true, default: "'pending'" }, // 'pending', 'accepted', 'blocked'
			created_at: {
				type: "timestamptz",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
			updated_at: {
				type: "timestamptz",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
		},
		{
			constraints: {
				primaryKey: ["requester_id", "addressee_id"], // 複合主鍵
				check: "requester_id <> addressee_id", // CHECK 約束
			},
		}
	);
	// 為 status 建立索引可能有助於查詢特定狀態的好友關係
	pgm.createIndex("friendships", "status");

	// 5. 建立 room_members (聊天室成員) 資料表
	pgm.createTable(
		"room_members",
		{
			room_id: {
				type: "uuid",
				notNull: true,
				references: "chat_rooms(id)",
				onDelete: "CASCADE",
			},
			user_id: {
				type: "uuid",
				notNull: true,
				references: "users(id)",
				onDelete: "CASCADE",
			},
			joined_at: {
				type: "timestamptz",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
			// last_read_at: { type: 'timestamptz', notNull: false }, // (可選)
		},
		{
			constraints: {
				primaryKey: ["room_id", "user_id"], // 複合主鍵
			},
		}
	);
	// room_members 表通常會有很多基於 room_id 或 user_id 的查詢，所以外鍵本身通常會被資料庫自動建立索引
	pgm.createIndex("room_members", "user_id");

	// 6. 建立 messages (訊息) 資料表
	pgm.createTable("messages", {
		id: {
			type: "uuid",
			primaryKey: true,
			default: pgm.func("gen_random_uuid()"),
		},
		room_id: {
			type: "uuid",
			notNull: true,
			references: "chat_rooms(id)",
			onDelete: "CASCADE",
		},
		sender_id: {
			type: "uuid",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE", // 或 SET NULL 如果希望保留匿名訊息
		},
		content: { type: "text", notNull: true },
		created_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});
	// 為 messages 表的重要查詢欄位建立索引
	pgm.createIndex("messages", "room_id");
	pgm.createIndex("messages", "sender_id");
	pgm.createIndex("messages", ["room_id", "created_at"]); // 常用於查詢某房間的訊息並按時間排序

	console.info("UP 遷移執行完畢。");
}

// 向下遷移：撤銷 up 函式所做的變更
export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("messages", { ifExists: true, cascade: true }); // cascade 會一併移除依賴此表的外鍵

	pgm.dropTable("room_members", { ifExists: true, cascade: true });

	pgm.dropTable("friendships", { ifExists: true, cascade: true });

	pgm.dropTable("chat_rooms", { ifExists: true, cascade: true });

	pgm.dropTable("user_preferences", { ifExists: true, cascade: true });

	pgm.dropTable("users", { ifExists: true, cascade: true }); // users 是基礎表，通常最後刪

	console.info("DOWN 遷移執行完畢。");
}
