import { z } from "zod/v4";
import { ApiResponseSchema } from "./api.schema";

export const EditProfileSchema = z.object({
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

export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>;

export const ProfileSchema = z.object({
	id: z.string(),
	username: z.string().min(1).max(50),
	age: z.number().int().positive(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;

export const GetUserSchema = z.object({
	userId: z.string(),
});

export type GetUserSchemaType = z.infer<typeof GetUserSchema>;

export const ProfileResponseSchema = ApiResponseSchema.extend({
	data: ProfileSchema,
});

export type ProfileResponseSchemaType = z.infer<typeof ProfileResponseSchema>;

export const SearchUserSchema = z.object({
	q: z.string().min(1, {
		message: "請輸入搜尋內容",
	}),
});

export type SearchUserSchemaType = z.infer<typeof SearchUserSchema>;

export const UserSchema = z.object({
	id: z.string().uuid(),
	username: z.string(),
	email: z.string().email(),
	avatar_url: z.string().nullable(), // 因為 avatar_url 在資料庫中可能是 null
});

export type UserSchemaType = z.infer<typeof UserSchema>;

export const SearchResponseSchema = ApiResponseSchema.extend({
	data: z.array(UserSchema),
});

export type SearchResponseSchemaType = z.infer<typeof SearchResponseSchema>;
