import { WebSocketServer, WebSocket } from "ws";

export const wss = new WebSocketServer({ noServer: true });

/**
 * 全域共享的實例，用於管理 WebSocket 的客戶。
 * Key: userId (string), Value: WebSocket 連線物件
 */
export const userConnections = new Map<string, WebSocket>();
/**
 * 全域共享的實例，用於管理不同聊天室中的 WebSocket 的客戶。
 * Key: roomId (string), Value: WebSocket 連線物件的 Set
 */
export const roomConnections = new Map<string, Set<WebSocket>>();
/**
 * 全域共享的實例，用於管理聊天室線上的 WebSocket 的客戶。
 * Key: userId (string), Value: roomId (string)
 */
export const acvtiveRoomViewers = new Map<string, string>();
