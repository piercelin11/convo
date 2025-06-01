/**
 * 使用者表格在資料庫的原始記錄型別
 */
export type UserRecord = {
	id: string; // uuid
	username: string; // varchar(50)
	email: string; // varchar(255)
	password_hash: string; // varchar(255)
	age: number | null; // integer, nullable
	avatar_url: string | null; // text, nullable
	created_at: Date; // timestamptz (node-postgres 通常會將其轉換為 JavaScript Date 物件)
	updated_at: Date; // timestamptz
};

/**
 * 使用者偏好設定表格在資料庫的原始記錄型別
 */
export type UserPreferenceRecord = {
	user_id: string; // uuid, PK, FK to users.id
	theme: string; // varchar(20), default 'light'
	notifications_enabled: boolean; // boolean, default true
	updated_at: Date; // timestamptz
};


export type ChatRoomType = "direct" | "group";

/**
 * 聊天室表格在資料庫的原始記錄型別
 */
export type ChatRoomRecord = {
	id: string; // uuid
	name: string | null; // varchar(100), nullable
	type: ChatRoomType; // varchar(20)
	creator_id: string | null; // uuid, nullable, FK to users.id
	created_at: Date; // timestamptz
	updated_at: Date; // timestamptz
};

/**
 * 好友關係表格在資料庫的原始記錄型別
 */
export type FriendshipStatus = "pending" | "accepted" | "blocked"; // 或其他你定義的狀態

export type FriendshipRecord = {
	requester_id: string; // uuid, FK to users.id
	addressee_id: string; // uuid, FK to users.id
	status: FriendshipStatus; // varchar(20), default 'pending'
	created_at: Date; // timestamptz
	updated_at: Date; // timestamptz
};

/**
 * 聊天室成員表格在資料庫的原始記錄型別
 */
export type RoomMemberRecord = {
	room_id: string; // uuid, FK to chat_rooms.id
	user_id: string; // uuid, FK to users.id
	joined_at: Date; // timestamptz
	// last_read_at?: Date | null; // 如果你之後加入這個可選欄位
};

/**
 * 訊息表格在資料庫的原始記錄型別
 */
export type MessageRecord = {
	id: string; // uuid (如果你用 UUID 作為主鍵) 或者 number (如果你用 SERIAL/BIGSERIAL)
	room_id: string; // uuid, FK to chat_rooms.id
	sender_id: string; // uuid, FK to users.id
	content: string; // text
	created_at: Date; // timestamptz
};
