import { useState } from "react";
import ProfileModal from "./ProfileModal";
import FaceIcon from "@mui/icons-material/Face";
import Button from "../ui/Button";

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
				<FaceIcon />
			</Button>
		</div>
	);
}
