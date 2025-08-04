import { unknown } from "zod/v4";

/**
 * 基礎的自定義錯誤類別，所有其他特定錯誤類別都將繼承它。
 * 用於標準化應用程式中的錯誤處理，提供狀態碼和操作性標誌。
 *
 * @property message - 錯誤訊息。
 * @property statusCode - HTTP 狀態碼，表示錯誤的類型。
 * @property isOperational - 布林值，指示這是否是一個「操作性錯誤」（預期且可處理的錯誤，例如使用者輸入無效、網路問題），而非「程式錯誤」（未預期的程式碼缺陷）。
 * @property name - 錯誤的名稱，預設為類別名稱。
 * @property cause - 原始錯誤的參考，可選。
 */
export class CustomError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
		public readonly isOperational: boolean = true, // 預設為操作性錯誤
		options?: { cause: unknown }
	) {
		super(message, options);
		this.name = this.constructor.name; // 將錯誤名稱設為子類別的名稱，以便識別

		// 確保原型鏈正確，以便 instanceof 正常運作
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * 表示客戶端請求的參數或格式無效的錯誤 (HTTP 400 Bad Request)。
 * 這是操作性錯誤，表示客戶端發送了不符合預期的請求。
 *
 * @augments CustomError
 */
export class BadRequestError extends CustomError {
	constructor(
		message: string = "請求的參數或格式無效",
		options?: { cause: unknown }
	) {
		super(message, 400, true, options);
	}
}

/**
 * 表示身份驗證失敗的錯誤 (HTTP 401 Unauthorized)。
 * 通常用於客戶端未提供有效認證憑證的場景。
 *
 * @augments CustomError
 */
export class AuthenticationError extends CustomError {
	constructor(message: string = "身份驗證失敗", options?: { cause: unknown }) {
		super(message, 401, true, options);
	}
}

/**
 * 表示使用者沒有足夠權限執行所請求操作的錯誤 (HTTP 403 Forbidden)。
 * 通常用於客戶端身份已驗證，但授權檢查失敗的場景。
 *
 * @augments CustomError
 */
export class AuthorizationError extends CustomError {
	constructor(message: string = "權限不足", options?: { cause: unknown }) {
		super(message, 403, true, options);
	}
}

/**
 * 表示請求的資源未找到的錯誤 (HTTP 404 Not Found)。
 * 用於客戶端請求的資源不存在的場景。
 *
 * @augments CustomError
 */
export class NotFoundError extends CustomError {
	constructor(
		message: string = "請求的資源未找到",
		options?: { cause: unknown }
	) {
		super(message, 404, true, options);
	}
}

/**
 * 表示資料庫互動失敗的錯誤 (HTTP 500 Internal Server Error)。
 * `isOperational` 屬性可用於區分資料庫連線問題 (true) 和程式碼邏輯錯誤 (false)。
 *
 * @augments CustomError
 */
export class DatabaseError extends CustomError {
	constructor(
		message: string = "資料庫互動失敗",
		// 注意：這裡的 isOperational 預設為 false，表示它是非操作性的程式錯誤
		// 但在 dbQuery/dbTransaction 中，對於網路問題會將其設為 true
		public readonly isOperational: boolean = false,
		options?: { cause: unknown }
	) {
		super(message, 500, isOperational, options);
	}
}

export class ConflictError extends CustomError {
	constructor(
		message: string = "請求與伺服器的當前狀態發生衝突",
		options?: { cause: unknown }
	) {
		super(message, 409, false, options);
	}
}

/**
 * 表示伺服器發生未預期錯誤的錯誤 (HTTP 500 Internal Server Error)。
 * 通常用於無法歸類到其他特定錯誤類型，且表示程式碼存在缺陷的場景。
 * 預設為非操作性錯誤。
 *
 * @augments CustomError
 */
export class InternalServerError extends CustomError {
	constructor(
		message = "伺服器發生錯誤",
		public readonly isOperational: boolean = false, // 預設為非操作性錯誤
		options?: { cause: unknown }
	) {
		super(message, 500, isOperational, options);
	}
}
