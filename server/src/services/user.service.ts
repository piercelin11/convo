import * as userDb from "@/db/users.db.js";
import { ConflictError, NotFoundError } from "@/utils/error.utils.js";

// 定義 UserDto 的型別
type UserDto = {
	id: string;
	username: string;
	age: number;
};

export async function editUserProfile(
	userId: string,
	username: string,
	age: number
) {
	// 1. 檢查使用者是否存在
	const userToUpdate = await userDb.findUserById(userId);
	if (!userToUpdate) {
		throw new NotFoundError("找不到指定的使用者。");
	}

	// 2. 確認新使用者名稱是否已被使用，但排除自己
	if (username !== userToUpdate.username) {
		const existingUser = await userDb.findUserByUsername(username);

		if (existingUser) {
			throw new ConflictError("此使用者名稱已被使用，請更換一個。");
		}
	}

	// 3. 更新使用者資料
	const data = await userDb.updateUser(userId, username, age);

	if (!data) {
		throw new NotFoundError("找不到指定的使用者。");
	}

	// 4. 將更新後的使用者物件轉換成 DTO
	const userDto: UserDto = {
		id: data.id,
		username: data?.username,
		age: data?.age ?? 0,
	};

	// 5. 回傳 DTO
	return userDto;
}

export async function getUserData(userId: string) {
	// 1. 根據使用者 ID 獲取使用者資料
	const user = await userDb.findUserById(userId);

	// 2. 如果找不到使用者，則拋出 NotFoundError
	if (!user) {
		throw new NotFoundError("找不到指定的使用者。");
	}

	const userDto: UserDto = {
		id: user.id,
		username: user.username,
		age: user?.age ?? 0,
	};

	// 3. 回傳使用者資料
	return userDto;
}
