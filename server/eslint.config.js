import js from "@eslint/js"; // ESLint 官方推薦的 JavaScript 規則
import tseslint from "typescript-eslint"; // TypeScript ESLint 的整合包
import globals from "globals"; // 用於引入標準的全域變數集合
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
	{
		ignores: ["dist/", "node_modules/"],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/**/*.ts"], // 只針對 src 目錄下的 .ts 檔案
		languageOptions: {
			ecmaVersion: 2022, // 或 'latest'
			sourceType: "module", // 非常重要，因為你的後端是 ESM
			globals: {
				...globals.node, // Node.js 的全域變數 (例如 process, console)
				...globals.es2021, // (或更高版本) ES 語法版本的全域變數
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
		},
	},
	eslintPluginPrettierRecommended,
	{
		rules: {
			"prettier/prettier": "warn",
		},
	}
);
