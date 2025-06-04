import { FriendshipStatus } from "./db.types";

export type UserDTO = {
	id: string; // uuid
	username: string; // varchar(50)
	email: string; // varchar(255)
	age: number | null; // integer, nullable
	avatar_url: string | null; // text, nullable
};

export type FriendshipDto = {
	id: string;
	username: string;
	email: string;
	avatar_url: string | null;
	friendship_status: FriendshipStatus;
};
