import {
	ProfileResponseSchema,
	type EditProfileSchemaType,
	type ProfileSchemaType,
} from "@convo/shared";
import axiosClient from "./client";

export const userService = {
	editProfile: async (
		formData: EditProfileSchemaType
	): Promise<ProfileSchemaType> => {
		const response = await axiosClient.patch("/users/profile", formData);
		const validatedData = ProfileResponseSchema.parse(response.data);
		return validatedData.data;
	},
	getUser: async (userId: string): Promise<ProfileSchemaType> => {
		const { data } = await axiosClient.get(`/users/${userId}`);
		const validatedData = ProfileResponseSchema.parse(data);
		return validatedData.data;
	},
};
