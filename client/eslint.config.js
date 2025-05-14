import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
	{
		ignores: ["dist/", "node_modules/", ".eslintrc.cjs"],
	},

	js.configs.recommended,

	...tseslint.configs.recommended,

	{
		files: ["src/**/*.{ts,tsx}"],
		plugins: {
			react: eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"react-refresh": eslintPluginReactRefresh,
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
		},
		rules: {
			...(eslintPluginReact.configs.recommended?.rules || {}),
			...(eslintPluginReactHooks.configs.recommended?.rules || {}),

			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",

			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	eslintPluginPrettierRecommended,
	{
		rules: {
			"prettier/prettier": "warn",
		},
	}
);
