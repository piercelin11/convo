/* type NotificationModalProps = {}; */

import { useState } from "react";
import Tab from "../ui/Tab";
import Avatar from "../ui/Avatar";
import { env } from "@/config/env";
import Button from "../ui/Button";

const tabOptions = [
	{ id: "friend-request", label: "好友邀請" },
	{ id: "system-announcement", label: "系統通知" },
] as const;

export default function NotificationModal() {
	const [currentTabId, setCurrrentTabId] =
		useState<(typeof tabOptions)[number]["id"]>("friend-request");

	const array = Array.from({ length: 50 }, (_, index) => index + 1);
	return (
		<section>
			<Tab
				tabOptions={tabOptions}
				currentTabId={currentTabId}
				onTabChange={setCurrrentTabId}
			/>
			<ul className="max-h-80 overflow-y-scroll pt-6">
				{array.map((item) => (
					<li key={item} className="flex items-center gap-2 rounded-xl p-2">
						<Avatar src={env.VITE_USER_IMG_PLACEHOLDER} size={55} />
						<div className="flex-1 overflow-hidden pr-2">
							<div className="flex items-center">
								<p>{item}</p>
							</div>
							<div className="flex gap-4">
								<p className="text-description overflow-hidden text-ellipsis whitespace-nowrap">
									{item}
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Button>確認</Button>
							<Button variant="secondary">刪除</Button>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
