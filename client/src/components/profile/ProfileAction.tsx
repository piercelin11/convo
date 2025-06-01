import { useState } from "react";
import ProfileModal from "./ProfileModal";
import Button from "../ui/Button";
import { X } from "react-feather";

// type ProfileActionProps = {

// };

export default function ProfileAction() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const editHandler = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			{isOpen && <ProfileModal closeHandler={editHandler} isOpen={isOpen} />}
			<Button onClick={editHandler}>
				<X />
			</Button>
		</div>
	);
}
