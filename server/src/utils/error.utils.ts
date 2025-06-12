export class CustomError extends Error {
	constructor(
		message: string,
		readonly statusCode: number,
		readonly isOperational: boolean = true,
		options?: { cause: unknown }
	) {
		super(message, options);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class BadRequestError extends CustomError {
	constructor(
		message: string = "請求的參數或格式無效",
		options?: { cause: unknown }
	) {
		super(message, 400, true, options);
	}
}

export class AuthenticationError extends CustomError {
	constructor(message: string = "身份驗證失敗", options?: { cause: unknown }) {
		super(message, 401, true, options);
	}
}

export class AuthorizationError extends CustomError {
	constructor(message: string = "權限不足", options?: { cause: unknown }) {
		super(message, 403, true, options);
	}
}

export class NotFoundError extends CustomError {
	constructor(
		message: string = "請求的資源未找到",
		options?: { cause: unknown }
	) {
		super(message, 404, true, options);
	}
}

export class DatabaseError extends CustomError {
	constructor(
		message: string = "資料庫互動失敗",
		readonly isOperational: boolean = false,
		options?: { cause: unknown }
	) {
		super(message, 500, isOperational, options);
	}
}

export class InternalServerError extends CustomError {
	constructor(
		message = "伺服器發生錯誤",
		readonly isOperational: boolean = false,
		options?: { cause: unknown }
	) {
		super(message, 500, isOperational, options);
	}
}
