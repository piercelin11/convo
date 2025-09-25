import z from "zod/v4";
import { ApiResponseSchema } from "./api.schema";
import { FriendshipDtoSchema, FriendshipDto } from "./dto.schema";

// 驗證目標使用者ID的通用Schema
// 這是前端在POST/PATCH/DELETE 請求中傳入的資料
export const targetUserSchema = z.object({
	targetUserId: z.string(),
});

export type TargetUserSchemaType = z.infer<typeof targetUserSchema>;

// 驗證好友邀請發送者ID的通用Schema
// 適用於接受、拒絕等需要回覆邀請的動作
export const requesterSchema = z.object({
	requesterId: z.string(),
});

export type RequesterSchemaType = z.infer<typeof requesterSchema>;

/**
 * 接受好友邀請的 Schema
 * 前端需要傳入發出邀請者的 ID
 */

export const AcceptFriendRequestSchema = requesterSchema;

/**
 * 接受方拒絕好友邀請的 Schema
 * 前端需要傳入發出邀請者的 ID
 */

export const RejectFriendRequestSchema = requesterSchema;

/**
 * 要求方取消好友邀請的 Schema
 * 前端需要傳入邀請目標的 ID
 */

export const CancelFriendRequestSchema = targetUserSchema;

/**
 * 封鎖使用者的 Schema
 * 前端需要傳入要封鎖的使用者 ID
 */

export const BlockUserSchema = targetUserSchema;

/**
 * 解除封鎖的 Schema
 * 前端需要傳入要解除封鎖的使用者 ID
 */
export const UnblockUserSchema = targetUserSchema;

/**
 * 獲取所有好友邀請的 Schema
 * 這是一個 GET 請求，通常沒有請求主體。
 * 因此我們只定義一個空物件。
 */

export const GetFriendRequestsSchema = z.object({});

/**
 * 搜尋好友邀請的 Schema
 * 用於驗證前端傳入的搜尋關鍵字。
 */

export const SearchFriendRequestsSchema = z.object({
	q: z.string().min(1, { message: "請輸入搜尋內容" }),
});

/**

/**
 * 取得好友相關的 API 回應資料結構。
 * API 回應中包含好友紀錄的資料結構 {@link FriendshipDtoSchema}。
 */
export const FriendshipResponseSchema = ApiResponseSchema.extend({
	data: z.array(FriendshipDtoSchema),
});

/**
 * 取得好友相關的 API 回應資料型別。
 * API 回應中包含好友紀錄的資料型別 {@link FriendshipDto}。
 */
export type FriendshipResponseType = z.infer<typeof FriendshipResponseSchema>;

// -------------------------------------------------------------
// 回應 (Response) 的 Schema
// -------------------------------------------------------------

// 定義單一使用者基本資訊的 Schema
const UserInfoSchema = z.object({
	id: z.string(),
	username: z.string(),
	avatar_url: z.string().nullable(),
});

/**
 * 定義單一好友邀請回應的資料結構
 * 使用扁平結構，匹配數據庫查詢結果和前端使用
 */
export const FriendshipRequestResponseSchema = z.object({
	requester_id: z.string(),
	addressee_id: z.string(),
	username: z.string(),
	avatar_url: z.string().nullable(),
	status: z.enum(["pending", "accepted", "blocked"]),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

/**
 * 獲取好友邀請列表的回應 Schema
 */
export const FriendRequestListResponseSchema = ApiResponseSchema.extend({
	data: z.array(FriendshipRequestResponseSchema),
});

/**
 * 好友邀請回應項目的類型
 */
export type FriendshipRequestItemType = z.infer<typeof FriendshipRequestResponseSchema>;

/**
 * 好友邀請列表回應的類型
 */
export type FriendRequestListResponseType = z.infer<typeof FriendRequestListResponseSchema>;

/**
 * 送出或接受邀請等單一動作的回應 Schema
 * 這些動作通常只回傳單一紀錄或簡單訊息，不回傳陣列。
 */

export const FriendshipActionResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		message: z.string(), // 例如: "好友邀請已送出"
	}),
});
