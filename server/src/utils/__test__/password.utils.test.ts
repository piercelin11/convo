import { jest } from "@jest/globals";

jest.unstable_mockModule("bcryptjs", () => ({
	genSaltSync: jest.fn(),
	hashSync: jest.fn(),
}));

import bcrypt from "bcryptjs";

describe("hashPassword 工具函式測試", () => {
	let hashPassword: (password: string, saltRounds?: number) => string;
	let mockedBcrypt: jest.MockedObject<typeof bcrypt>;
	beforeEach(async () => {
		hashPassword = (await import("../password.utils")).hashPassword;
		const bcrypt = await import("bcryptjs");
		mockedBcrypt = jest.mocked(bcrypt);
	});

	test("應正確呼叫 bcryptjs 的函式並回傳雜湊後的密碼", async () => {
		const passwordInput = "password123";
		const saltRoundsInput = 5;
		const expectedSalt = "test-salt";
		const expectedHashedPassword = "mockedHashedPasswordValue";

		mockedBcrypt.genSaltSync.mockReturnValue(expectedSalt);
		mockedBcrypt.hashSync.mockReturnValue(expectedHashedPassword);

		const hashedPassword = hashPassword(passwordInput, saltRoundsInput);

		expect(mockedBcrypt.genSaltSync).toHaveBeenCalledTimes(1);
		expect(mockedBcrypt.genSaltSync).toHaveBeenCalledWith(saltRoundsInput);

		expect(mockedBcrypt.hashSync).toHaveBeenCalledTimes(1);
		expect(mockedBcrypt.hashSync).toHaveBeenCalledWith(
			passwordInput,
			expectedSalt
		);

		expect(hashedPassword).toBe(expectedHashedPassword);
	});

	test("若無傳入 'saltRound' 參數，應正確帶入預設值 '10'", async () => {
		const passwordInput = "password123";
		const expectedSalt = "test-salt";
		const expectedHashedPassword = "mockedHashedPasswordValue";

		mockedBcrypt.genSaltSync.mockReturnValue(expectedSalt);
		mockedBcrypt.hashSync.mockReturnValue(expectedHashedPassword);

		const hashedPassword = hashPassword(passwordInput);

		expect(mockedBcrypt.genSaltSync).toHaveBeenCalledTimes(1);
		expect(mockedBcrypt.genSaltSync).toHaveBeenCalledWith(10);

		expect(mockedBcrypt.hashSync).toHaveBeenCalledTimes(1);
		expect(mockedBcrypt.hashSync).toHaveBeenCalledWith(
			passwordInput,
			expectedSalt
		);

		expect(hashedPassword).toBe(expectedHashedPassword);
	});
});
