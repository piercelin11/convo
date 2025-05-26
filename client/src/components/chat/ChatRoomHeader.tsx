import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import { DropdownItem } from "@/components/ui/DropdownItem";
import IconBtn from "@/components/ui/IconBtn";
import { USER_PLACEHOLDER } from "@/config/constants";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ArrowLeft, MoreVertical, Search } from "react-feather";
import { Link } from "react-router-dom";

/**
 * 聊天室上方顯示聊天室資訊與其他功能的 Header
 * @returns 一個包含`img`、文字資訊以及搜尋與更多選項按鈕的 JSX 元素
 */
export default function ChatRoomHeader() {
	const isMobile = useMediaQuery("max", 640);
	const array = Array.from({ length: 5 }, (_, index) => index);

	return (
		<div className="h-header flex items-center justify-between px-4">
			<div className="flex items-center gap-2">
				{isMobile && (
					<Link to={"/"}>
						<ArrowLeft
							size={20}
							className="text-neutral-500 hover:text-neutral-100"
						/>
					</Link>
				)}
				<Avatar src={USER_PLACEHOLDER} size={40} />
				<p className="text-neutral-300">Chat room</p>
			</div>
			<div className="flex items-center gap-2">
				<IconBtn>
					<Search className="text-neutral-500" />
				</IconBtn>
				<Dropdown
					trigger={
						<IconBtn>
							<MoreVertical className="text-neutral-500" />
						</IconBtn>
					}
					align="right"
				>
					{array.map((item) => (
						<DropdownItem key={item}>{item}</DropdownItem>
					))}
				</Dropdown>
			</div>
		</div>
	);
}
