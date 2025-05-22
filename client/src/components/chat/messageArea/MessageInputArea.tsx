/**
 * 負責聊天室中輸入訊息與其他傳送功能相關的區塊
 * @returns 一個包含`input`的 JSX 元素
 */
export default function MessageInputArea() {
	return (
		<div className="px-16 py-4">
			<div className="flex flex-1 items-center gap-2 rounded-xl bg-neutral-900 p-4">
				<input
					type="text"
					placeholder="Search"
					className="w-full focus:outline-none"
				/>
			</div>
		</div>
	);
}
