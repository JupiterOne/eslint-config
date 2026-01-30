// @ts-check
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";
import globals from "globals";
import { createBaseConfig, nodeFetchGlobals } from "./base.mjs";

/**
 * Default file patterns for Jest test files
 */
export const jestFilePatterns = [
  "jest.*.{ts,mts,cts,js,mjs,cjs}",
  "**/test/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}",
  "**/*.test.{ts,tsx,mts,cts,js,jsx,mjs,cjs}",
  "**/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}",
  "**/__mocks__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}",
];

/**
 * Jest-specific ESLint rules
 * @type {import("eslint").Linter.RulesRecord}
 */
export const jestRules = {
  ...jest.configs["flat/recommended"].rules,
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/unbound-method": "off",
  "jest/expect-expect": "off",
  "jest/valid-title": "off",
};

/**
 * Creates a Jest ESLint flat config for test files
 * @param {Object} options - Configuration options
 * @param {string[]} [options.files] - Custom file patterns (defaults to jestFilePatterns)
 * @returns {import("eslint").Linter.Config}
 */
export function createJestConfig(options = {}) {
  const { files = jestFilePatterns } = options;

  return {
    files,
    plugins: {
      jest,
    },
    rules: jestRules,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...nodeFetchGlobals,
      },
    },
  };
}

/**
 * Creates a complete ESLint flat config for TypeScript + Jest projects
 * @param {Object} options - Configuration options
 * @param {string} options.tsconfigRootDir - Root directory for tsconfig.json (required - use import.meta.dirname)
 * @param {string[]} [options.jestFiles] - Custom file patterns for Jest (optional)
 * @param {import("eslint").Linter.Config[]} [options.additionalConfigs] - Additional configs to append
 * @returns {import("eslint").Linter.Config[]}
 */
export function createConfig(options) {
  const { tsconfigRootDir, jestFiles, additionalConfigs = [] } = options;

  if (!tsconfigRootDir) {
    throw new Error(
      "tsconfigRootDir is required. Use import.meta.dirname in your eslint.config.mjs"
    );
  }

  return defineConfig(
    ...createBaseConfig({ tsconfigRootDir }),
    createJestConfig({ files: jestFiles }),
    ...additionalConfigs
  );
}

export { jest };
