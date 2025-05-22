import ChatRoomItem from "@/components/chat/ChatRoomItem";

export default function ChatPage() {
	const array = Array.from({ length: 50 }, (_, index) => index);
	return (
		<div className="flex h-dvh">
			<aside className="w-sidebar-lg flex h-full flex-col bg-neutral-900">
				<div className="min-h-header">header</div>
				<div className="flex-grow overflow-y-auto overscroll-contain p-2">
					<ul>
						{array.map((index) => (
							<ChatRoomItem key={index} />
						))}
					</ul>
				</div>
			</aside>
			<main className="w-full">chat</main>
		</div>
	);
}
