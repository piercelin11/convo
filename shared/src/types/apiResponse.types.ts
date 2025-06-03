import { ChatRoomRecord } from "./db.types";
import { UserDTO } from "./dto.types";

export type ApiResponseType = {
	success: boolean;
	message: string;
};

export type AuthResponseType = ApiResponseType & {
	user?: UserDTO;
};

export type ChatRoomsResponseType = ApiResponseType & {
	chatRooms: ChatRoomRecord[];
};
