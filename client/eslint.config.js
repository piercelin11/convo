import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginJSDoc from "eslint-plugin-jsdoc";

export default tseslint.config(
	{
		ignores: ["dist/", "node_modules/", ".eslintrc.cjs"],
	},

	js.configs.recommended,
	eslintPluginJSDoc.configs["flat/recommended"],

	...tseslint.configs.recommended,

	{
		files: ["src/**/*.{ts,tsx}"],
		plugins: {
			react: eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"react-refresh": eslintPluginReactRefresh,
			jsdoc: eslintPluginJSDoc,
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.es2020,
			},
		},
		settings: {
			react: {
				version: "detect",
			},
			jsdoc: {
				mode: "typescript",
			},
		},
		rules: {
			...(eslintPluginReact.configs.recommended?.rules || {}),
			...(eslintPluginReactHooks.configs.recommended?.rules || {}),

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
			"jsdoc/tag-lines": "off",

			"jsdoc/check-alignment": "warn",
			"jsdoc/check-indentation": "warn",

			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",

			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "warn",
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
