import useMediaQuery from "@/hooks/useMediaQuery";
import { Outlet, useLocation } from "react-router-dom";
import ChatSidebar from "../sidebar/ChatSidebar";

export default function ChatLayout() {
	const isMobile = useMediaQuery("max", 640);
	const pathname = useLocation().pathname;

	return (
		<div className="flex h-dvh">
			{pathname === "/" ? <ChatSidebar /> : !isMobile ? <ChatSidebar /> : null}
			<Outlet />
		</div>
	);
}
