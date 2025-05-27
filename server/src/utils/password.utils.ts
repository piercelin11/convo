import bcrypt from "bcryptjs";

/**
 * 加密密碼的工具函式
 * @param password - 使用者輸入的原始密碼。**必填**。
 * @returns 加密後的密碼字串。
 */
export function hashPassword(password: string): string {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	return hash;
}
