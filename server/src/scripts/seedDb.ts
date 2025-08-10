import pool from "@/config/database.js";
import { hashPassword } from "@/utils/index.js";

async function seedDb() {
	const client = await pool.connect();
	const users = [
		{
			username: "Alice",
			email: "alice@example.com",
			password: "password123",
			age: 30,
		},
		{
			username: "Bob",
			email: "bob@example.com",
			password: "password123",
			age: 28,
		},
		{
			username: "Charlie",
			email: "charlie@example.com",
			password: "password123",
			age: 35,
		},
	];
	try {
		await client.query("BEGIN");

		console.info("[seedDb]: 開始清理現有資料...");
		// 1. 刪除好友關係 (Friendships)
		await client.query(`DELETE FROM friendships;`);
		console.info("[seedDb]: 已刪除所有好友關係。");

		// 2. 刪除聊天室 (ChatRooms) - 如果有 ON DELETE CASCADE，會自動刪除 room_members 和 messages
		await client.query(`DELETE FROM chat_rooms;`);
		console.info("[seedDb]: 已刪除所有聊天室、成員及訊息 (透過 CASCADE)。");

		// 3. 刪除使用者偏好設定 (UserPreferences)
		await client.query(`DELETE FROM user_preferences;`);
		console.info("[seedDb]: 已刪除所有使用者偏好設定。");

		// 4. 刪除使用者 (Users)
		await client.query(`DELETE FROM users;`);
		console.info("[seedDb]: 已刪除所有使用者。");
		console.info("[seedDb]: 現有資料清理完成。");

		const allUserId = [];

		console.info("[seedDb]: 開始填充種子使用者資料");
		for (const user of users) {
			const { username, email, password, age } = user;
			const hashedPassword = hashPassword(password);

			const result = await client.query(
				`INSERT INTO users (username, email, password_hash, age) 
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;`,
				[username, email, hashedPassword, age]
			);

			// 只有當 ON CONFLICT DO NOTHING 沒有觸發時 (即確實插入了新行) 才加入 ID
			if (result.rows.length > 0) {
				allUserId.push(result.rows[0].id);
			} else {
				// 如果 ON CONFLICT 觸發，我們需要手動獲取現有用戶的 ID
				// 否則 allUserId 可能不包含所有必要的 ID
				const existingUserResult = await client.query(
					`SELECT id FROM users WHERE email = $1;`,
					[email]
				);
				if (existingUserResult.rows.length > 0) {
					allUserId.push(existingUserResult.rows[0].id);
				}
			}
		}

		// 確保至少有三個使用者 ID 可用，避免索引超出範圍
		if (allUserId.length < 3) {
			console.warn(
				"[seedDb]: 未能獲取足夠的使用者 ID 來建立好友關係和聊天室。請確保資料庫為空或 ON CONFLICT 邏輯正確。"
			);
			await client.query("ROLLBACK");
			return;
		}

		const aliceId = allUserId[0];
		const bobId = allUserId[1];
		const charlieId = allUserId[2];

		// --- 新增建立好友關係的邏輯 ---
		console.info("[seedDb]: 開始建立好友關係");
		await client.query(
			`INSERT INTO friendships (requester_id, addressee_id, status)
             VALUES ($1, $2, $3)
             ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = EXCLUDED.status;`, // 處理重複插入，更新狀態
			[aliceId, bobId, "accepted"]
		);

		await client.query(
			`INSERT INTO friendships (requester_id, addressee_id, status)
             VALUES ($1, $2, $3)
             ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = EXCLUDED.status;`,
			[bobId, charlieId, "accepted"]
		);

		await client.query(
			`INSERT INTO friendships (requester_id, addressee_id, status)
             VALUES ($1, $2, $3)
             ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = EXCLUDED.status;`,
			[charlieId, aliceId, "accepted"]
		);
		console.info("[seedDb]: 好友關係建立成功");

		console.info("[seedDb]: 開始建立聊天室");
		const chatRoomId = (
			await client.query(
				`INSERT INTO chat_rooms (name, type, creator_id)
                VALUES ($1, $2, $3)
                RETURNING id`,
				["Convo", "group", aliceId] // 假設 Alice 是建立者
			)
		).rows[0].id;

		console.info("[seedDb]: 開始填充聊天室成員");
		await client.query(
			`INSERT INTO room_members (room_id, user_id)
            VALUES ($1, $2), ($1, $3), ($1, $4)
            ON CONFLICT (room_id, user_id) DO NOTHING;`, // 處理重複插入
			[chatRoomId, aliceId, bobId, charlieId]
		);

		console.info("[seedDb]: 開始填充聊天室訊息");
		const messagesToSeed = [
			{
				roomId: chatRoomId,
				senderId: aliceId,
				content: "大家好，歡迎來到 Convo 群組聊天室！",
			},
			{
				roomId: chatRoomId,
				senderId: bobId,
				content: "哈囉 Alice！很高興能加入。",
			},
			{
				roomId: chatRoomId,
				senderId: charlieId,
				content: "嗨，我是 Charlie，大家都在嗎？",
			},
			{
				roomId: chatRoomId,
				senderId: aliceId,
				content: "我們都準備好了，隨時可以開始聊天！",
			},
		];

		for (const message of messagesToSeed) {
			await client.query(
				`INSERT INTO messages (room_id, sender_id, content)
                 VALUES ($1, $2, $3);`,
				[message.roomId, message.senderId, message.content]
			);
		}
		console.info("[seedDb]: 聊天室訊息填充成功");

		await client.query("COMMIT");
		console.info("[seedDb]: 種子使用者資料、好友關係和聊天室填充成功");
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("[seedDb]: 填充種子使用者時發生錯誤", error);
	} finally {
		client.release();
		console.info("[seedDb]: 腳本結束並將 'client' 釋放回資料庫池中");
	}
}

try {
	await seedDb();
} catch (error) {
	console.error("[seedDb]: 填充種子使用者時發生未預期錯誤", error);
	process.exit(1);
}
