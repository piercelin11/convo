import { useState } from "react";
import Step1SelectFriends from "./Step1SelectFriends";
import Step2EnterRoomInfo from "./Step2EnterRoomInfo";
import type { FriendshipDto } from "@convo/shared";

export default function CreateGroupChatForm() {
	const [selectedFriends, setSelectedFriends] = useState<FriendshipDto[]>([]);
	const [currentStep, setCurrentStep] = useState<1 | 2>(1);
	if (currentStep === 1)
		return (
			<div className="flex h-130 w-105 flex-col space-y-5">
				<Step1SelectFriends
					selectedFriends={selectedFriends}
					setSelectedFriends={setSelectedFriends}
					nextStep={() => setCurrentStep(2)}
				/>
			</div>
		);

	if (currentStep === 2)
		return (
			<div className="flex h-130 w-105 flex-col space-y-5">
				<Step2EnterRoomInfo
					selectedFriends={selectedFriends}
					setSelectedFriends={setSelectedFriends}
					prevStep={() => setCurrentStep(1)}
				/>
			</div>
		);
}
