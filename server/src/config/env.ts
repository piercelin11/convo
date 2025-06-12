import dotenv from "dotenv";
import { z } from "zod/v4";

dotenv.config();

const EnvSchema = z.object({
	DATABASE_URL: z.string().min(1, { message: "DATABASE_URL 環境變數未設定！" }),
	JWT_PRIVATE_KEY: z
		.string()
		.min(1, { message: "JWT_PRIVATE_KEY 環境變數未設定！" }),
	AWS_ACCESS_KEY_ID: z
		.string()
		.min(1, { message: "AWS_ACCESS_KEY_ID 環境變數未設定！" }),
	AWS_SECRET_ACCESS_KEY: z
		.string()
		.min(1, { message: "AWS_SECRET_ACCESS_KEY 環境變數未設定！" }),
	AWS_REGION: z.string().min(1, { message: "AWS_REGION 環境變數未設定！" }),
	S3_BUCKET_NAME: z
		.string()
		.min(1, { message: "S3_BUCKET_NAME 環境變數未設定！" }),
});

/**
 * 伺服器端環境變數的型別
 */
export type ServerEnv = z.infer<typeof EnvSchema>;

const validatedEnv = EnvSchema.safeParse(process.env);

if (!validatedEnv.success) {
	console.error(
		"[伺服器端]無效的環境變數設定！請檢查你的 .env 檔案是否正確配置。"
	);
	console.error(validatedEnv.error.flatten().fieldErrors);
	process.exit(1);
}

export const env: ServerEnv = validatedEnv.data;
