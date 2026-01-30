// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { defaultIgnores } from "./flat/base.mjs";

// Self-lint configuration for the eslint-config package
// Uses basic JS rules since the flat/ files are .mjs (not TypeScript)
export default [
  defaultIgnores,
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{mjs,js}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
];
