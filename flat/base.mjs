// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/**
 * Node.js 18+ Fetch API globals
 * @type {Record<string, "readonly">}
 */
export const nodeFetchGlobals = {
  fetch: "readonly",
  Request: "readonly",
  RequestInfo: "readonly",
  RequestInit: "readonly",
  Response: "readonly",
  Headers: "readonly",
  FormData: "readonly",
};

/**
 * Default ignore patterns for all projects
 * @type {import("eslint").Linter.Config}
 */
export const defaultIgnores = {
  ignores: ["node_modules/", "dist/", "work/", "coverage/", "**/*.bak/"],
};

/**
 * TypeScript rules - relaxed for gradual adoption
 * These rules are commonly disabled in JupiterOne projects
 * @type {import("eslint").Linter.RulesRecord}
 */
export const typescriptRules = {
  "@typescript-eslint/ban-types": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-inferrable-types": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-require-imports": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "@typescript-eslint/no-use-before-define": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/restrict-plus-operands": "off",
  "@typescript-eslint/restrict-template-expressions": "off",
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/prefer-string-starts-ends-with": "off",
  "@typescript-eslint/require-await": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/unbound-method": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
};

/**
 * Global rules applied to all files
 * @type {import("eslint").Linter.RulesRecord}
 */
export const globalRules = {
  "no-unused-vars": "off",
  "no-undef": "error",
  "no-constant-condition": "warn",
  // Prevent invisible character backdoors
  // https://certitude.consulting/blog/en/invisible-backdoor/
  "id-match": ["error", "^[a-zA-Z_]+[a-zA-Z0-9_]*$"],
};

/**
 * Creates a base ESLint flat config for TypeScript projects
 * @param {Object} options - Configuration options
 * @param {string} [options.tsconfigRootDir] - Root directory for tsconfig.json (defaults to import.meta.dirname of consumer)
 * @returns {import("eslint").Linter.Config[]}
 */
export function createBaseConfig(options = {}) {
  const { tsconfigRootDir } = options;

  /** @type {import("eslint").Linter.Config[]} */
  const configs = [
    // Global ignores
    defaultIgnores,

    // Base ESLint recommended rules
    eslint.configs.recommended,

    // TypeScript recommended rules with type checking
    ...tseslint.configs.recommendedTypeChecked,

    // Prettier config (disables formatting rules that conflict with prettier)
    eslintConfigPrettier,

    // TypeScript files configuration
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          projectService: true,
          ...(tsconfigRootDir && { tsconfigRootDir }),
        },
        globals: {
          ...globals.node,
          ...nodeFetchGlobals,
        },
      },
      rules: typescriptRules,
    },

    // Global rules
    {
      rules: globalRules,
    },
  ];

  return configs;
}

export { eslint, tseslint, eslintConfigPrettier, globals };
