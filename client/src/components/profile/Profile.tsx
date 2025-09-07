import { useAuth } from "@/store/auth/useAuth";
import useProfileQuery from "@/queries/user/useProfileQuery";

export default function Profile() {
	const { user: currentUser } = useAuth();
	const { data, isLoading, isError } = useProfileQuery(currentUser?.id || "");

	if (!currentUser) {
		return <p>Loading user data...</p>;
	}

	if (!currentUser || isLoading) {
		return <p>Loading user profile...</p>;
	}

	if (isError) {
		return <p>Error loading profile.</p>;
	}

	if (!data) {
		return <p>No user profile data available.</p>;
	}

	return (
		<div className="bg-white px-10 py-10 text-black">
			<p>Username: {data.username}</p>
			<p>Age: {data.age}</p>
		</div>
	);
}
