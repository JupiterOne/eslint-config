// @ts-check
import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import { nodeFetchGlobals } from "./base.mjs";

/**
 * Default file patterns for Vitest test files
 */
export const vitestFilePatterns = [
  "vitest.*.{ts,js}",
  "**/test/**/*.{ts,tsx,js,jsx}",
  "**/*.test.{ts,tsx,js,jsx}",
  "**/__mocks__/**/*.{ts,tsx,js,jsx}",
];

/**
 * Vitest-specific ESLint rules
 * @type {import("eslint").Linter.RulesRecord}
 */
export const vitestRules = {
  ...vitest.configs.recommended.rules,
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/unbound-method": "off",
  "vitest/expect-expect": "off",
  "vitest/valid-title": "off",
};

/**
 * Creates a Vitest ESLint flat config for test files
 * @param {Object} options - Configuration options
 * @param {string[]} [options.files] - Custom file patterns (defaults to vitestFilePatterns)
 * @returns {import("eslint").Linter.Config}
 */
export function createVitestConfig(options = {}) {
  const { files = vitestFilePatterns } = options;

  return {
    files,
    plugins: {
      vitest,
    },
    rules: vitestRules,
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...nodeFetchGlobals,
        ...vitest.environments.env.globals,
      },
    },
  };
}

export { vitest };
