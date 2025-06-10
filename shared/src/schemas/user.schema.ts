import { z } from "zod/v4";

export const editProfileSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, { message: "使用者名稱至少需要 3 個字元" })
		.max(20, { message: "使用者名稱不能超過 20 個字元" })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: "使用者名稱只能包含英文字母、數字和底線",
		})
		.nonempty({ message: "使用者名稱不能為空" }),
	age: z
		.string()
		.trim()
		.nonempty({ message: "年齡不能為空" })
		.transform((val) => Number(val))
		.refine((val) => !isNaN(val), { message: "年齡必須是數字" })
		.refine((val) => Number.isInteger(val), { message: "年齡必須是整數" })
		.refine((val) => val >= 0, { message: "年齡不能小於 0" })
		.pipe(z.number()),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
