import z from "zod/v4";

export const ApiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().min(1, { message: "API 回傳訊息至少需要有一個字" }),
});

export type ApiResponseSchemaType = z.infer<typeof ApiResponseSchema>;
