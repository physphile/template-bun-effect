/* eslint-disable @typescript-eslint/naming-convention */
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
// @ts-expect-error - no types available
import pluginPromise from "eslint-plugin-promise";
// @ts-expect-error - no types available
import pluginSecurity from "eslint-plugin-security";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import { configs as tseslint } from "typescript-eslint";

export default defineConfig([
	{
		ignores: ["**/*.d.ts", "dist", "node_modules", "src/shared/api/dit", "prettier.config.js"],
	},
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	tseslint.all,
	perfectionist.configs["recommended-natural"],
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	eslintPluginUnicorn.configs.all,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	pluginSecurity.configs.recommended,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	pluginPromise.configs["flat/recommended"],
	{
		rules: {
			"@typescript-eslint/consistent-return": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/prefer-readonly-parameter-types": "warn",
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowNumber: true,
				},
			],
			"import/no-unresolved": ["error", { ignore: ["^/", "^bun:"] }],
			"unicorn/filename-case": "off",
			"unicorn/no-array-callback-reference": "off",
			"unicorn/no-keyword-prefix": "off",
			"unicorn/no-null": "off",
			"unicorn/no-useless-undefined": "off",
			"unicorn/prefer-at": ["error", { checkAllIndexAccess: true }],
			"unicorn/prefer-ternary": "off",
			"unicorn/prevent-abbreviations": "off",
		},
		settings: {
			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
					project: "./tsconfig.json",
				},
			},
		},
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
	},
	eslintPluginPrettier,
]);
