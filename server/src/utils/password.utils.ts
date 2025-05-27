import * as bcrypt from "bcryptjs";

/**
 * 加密密碼的工具函式
 * @param password - 使用者輸入的原始密碼。**必填**。
 * @param saltRounds - （可選）加密的 `salt` 次數。
 * @returns 加密後的密碼字串。
 */
export function hashPassword(
	password: string,
	saltRounds: number = 10
): string {
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);

	return hash;
}
