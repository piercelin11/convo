/* eslint-disable jsdoc/require-jsdoc */
// 擴展 Express Request 介面，使其包含 `user` 屬性
export declare global {
	namespace Express {
		interface Request {
			/**
			 * 經過認證後，附加在請求物件上的使用者 Payload。
			 */
			user?: UserPayloadType;
		}
	}
}
