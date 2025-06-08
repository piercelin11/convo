import { z } from "zod/v4";

export const UsernameSchema = z
	.string()
	.trim()
	.min(1, { message: "使用者名稱至少要有一個字" })
	.max(20, { message: "使用者名稱最多只能有二十個字" });

export const PasswordSchema = z
	.string()
	.trim()
	.min(8, { message: "密碼至少要有八個字" })
	.max(30, { message: "密碼最多只能有三十個字" });

export const EmailSchema = z.email({ message: "電子郵件格式不正確" });
