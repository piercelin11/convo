import js from "@eslint/js"; // ESLint 官方推薦的 JavaScript 規則
import tseslint from "typescript-eslint"; // TypeScript ESLint 的整合包
import globals from "globals"; // 用於引入標準的全域變數集合
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginJSDoc from "eslint-plugin-jsdoc";

export default tseslint.config(
	{
		ignores: ["dist/", "node_modules/"],
	},

	js.configs.recommended,
	eslintPluginJSDoc.configs["flat/recommended"],
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
			"jsdoc/require-jsdoc": [
				"warn",
				{
					publicOnly: true,
					require: {
						FunctionDeclaration: false,
						MethodDefinition: false,
						ClassDeclaration: false,
					},
					contexts: [
						"TSEnumDeclaration",
						"TSInterfaceDeclaration",
						"TSTypeAliasDeclaration",
					],
					enableFixer: false,
				},
			],

			"jsdoc/check-tag-names": [
				"error",
				{
					definedTags: [
						"remarks",
						"experimental",
						"internal",
						"public",
						"private",
						"protected",
						"see",
						"example",
						"deprecated",
						"defaultValue",
					],
				},
			],
			"jsdoc/require-param": [
				"warn",
				{
					// 如果函式有參數且寫了 JSDoc，建議為每個參數寫 @param
					checkConstructors: false,
					checkDestructuredRoots: false,
				},
			],
			"jsdoc/require-param-description": "warn",
			"jsdoc/require-returns": "warn",
			"jsdoc/require-returns-description": "warn",
			"jsdoc/require-description": "warn",

			"jsdoc/no-types": "error",
			"jsdoc/require-param-type": "off",
			"jsdoc/require-returns-type": "off",

			"jsdoc/check-alignment": "warn",
			"jsdoc/check-indentation": "warn",

			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-namespace": "off",
			"no-console": ["warn", { allow: ["warn", "error", "info"] }],
		},
	},
	eslintPluginPrettierRecommended,
	{
		rules: {
			"prettier/prettier": "warn",
		},
	}
);
