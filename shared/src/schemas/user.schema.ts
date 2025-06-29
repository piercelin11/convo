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
	age: z.coerce
		.number({
			error: (issue) => {
				if (issue.input === undefined) {
					return { message: "年齡為必填項目" };
				}
				return { message: "年齡必須以數字形式提供" };
			},
		})
		.int({ error: "年齡必須是整數" })
		.positive({ error: "年齡必須是大於 0 的正數" })
		.min(6, { error: "使用者必須年滿 6 歲" })
		.max(120, { error: "請輸入一個合理的年齡" }),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
