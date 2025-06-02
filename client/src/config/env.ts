import { z } from "zod";

const EnvSchema = z.object({
	VITE_API_DATABASE_URL: z
		.string()
		.min(1, { message: "VITE_API_DATABASE_URL 環境變數未設定！" }),
	VITE_USER_IMG_PLACEHOLDER: z
		.string()
		.min(1, { message: "VITE_USER_IMG_PLACEHOLDER 環境變數未設定！" }),
});

/**
 * 客戶端環境變數的型別
 */
export type ClientEnv = z.infer<typeof EnvSchema>;

const validatedEnv = EnvSchema.safeParse(import.meta.env);

if (!validatedEnv.success) {
	console.error(
		"[客戶端]無效的環境變數設定！請檢查你的 .env 檔案是否正確配置。"
	);
	console.error(validatedEnv.error.flatten().fieldErrors);
}

if (!validatedEnv.data) {
	console.error("[客戶端]環境變數讀取失敗，請檢查你的 .env 檔案是否正確配置。");
	console.error(validatedEnv.error.flatten().fieldErrors);
}

export const env: ClientEnv = validatedEnv.data!;
