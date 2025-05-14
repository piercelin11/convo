/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	transform: {
		"^.+\\.m?[tj]sx?$": ["ts-jest", { useESM: true }],
	},
	moduleFileExtensions: [
		"js",
		"mjs",
		"cjs",
		"ts",
		"mts",
		"cts",
		"json",
		"node",
	],
};
