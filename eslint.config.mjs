import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ["**/dist/", "coverage/", "node_modules/", "**/*.d.ts"],
    },
    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        languageOptions: { globals: globals.jest }
    },
    {
        files: ["**/*.cjs"],
        rules: {
            "@typescript-eslint/no-require-imports": "off"
        }
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ]
        }
    }
];
