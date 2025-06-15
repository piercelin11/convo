import z from "zod/v4";

/**
 * 通用的 API 回應資料結構。
 * API 回應中包含 `success` 屬性與 `message` 屬性。
 */
export const ApiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().min(1, { message: "API 回傳訊息至少需要有一個字" }),
});

/**
 * 通用的 API 回應資料型別。
 * API 回應中包含 `success` 屬性與 `message` 屬性。
 */
export type ApiResponseSchemaType = z.infer<typeof ApiResponseSchema>;
