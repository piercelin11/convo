import { z } from "zod/v4";

/**
 * 通用的使用者名稱結構。
 */
export const UsernameSchema = z
	.string()
	.trim()
	.min(1, { message: "使用者名稱至少要有一個字" })
	.max(20, { message: "使用者名稱最多只能有二十個字" });

/**
 * 通用的使用者密碼結構。
 */
export const PasswordSchema = z
	.string()
	.trim()
	.min(8, { message: "密碼至少要有八個字" })
	.max(30, { message: "密碼最多只能有三十個字" });

/**
 * 通用的使用者電子郵件結構。
 */
export const EmailSchema = z.email({ message: "電子郵件格式不正確" });

/**
 * 通用的使用者搜尋結構。
 */

export const SearchQuerySchema = z.object({
	q: z.string().min(1, { message: "Search query must not be empty" }),
});

export type SearchQuerySchemaType = z.infer<typeof SearchQuerySchema>;
