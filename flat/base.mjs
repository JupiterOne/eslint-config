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
 * ESLint TypeScript rules that are disabled by default
 * Overrides to: tseslint.configs.recommendedTypeChecked.rules
 * These overrides take precedence over the recommended rules.
 * Add rules here as needed, if there are rules that we find to be too strict for our use case across consuming projects.
 * @type {import("eslint").Linter.RulesRecord}
 */
export const typescriptDisabledRules = {};

/**
 * TypeScript ESLint recommended rules for TypeScript projects with type checking enabled
 */
export const typescriptRecommendedRules = [
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.recommended,
];

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
  "id-match": ["error", "^(_|[a-zA-Z_][a-zA-Z0-9_]*)$"],
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
    ...typescriptRecommendedRules,

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
      rules: typescriptDisabledRules,
    },

    // Global rules
    {
      rules: globalRules,
    },
  ];

  return configs;
}

export { eslint, tseslint, eslintConfigPrettier, globals };
