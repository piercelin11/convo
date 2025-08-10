import { UserPayloadType } from "@/middlewares/authenticateToken.ts";

/* eslint-disable jsdoc/require-jsdoc */
export declare module "ws" {
	interface WebSocket {
		currentRoomId?: string;
		user?: UserPayloadType;
		isAlive?: boolean;
	}
}
