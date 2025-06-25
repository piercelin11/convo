const messageKeys = {
	all: ["messages"] as const,
	room: (roomId: string) => [...messageKeys.all, roomId] as const,
};

export default messageKeys;
