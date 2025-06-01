export type UserDTO = {
	id: string; // uuid
	username: string; // varchar(50)
	email: string; // varchar(255)
	age: number | null; // integer, nullable
	avatar_url: string | null; // text, nullable
};