// @ts-check
import { defineConfig } from "eslint/config";
import {
  createBaseConfig,
  defaultIgnores,
  typescriptRules,
  globalRules,
  nodeFetchGlobals,
  eslint,
  tseslint,
  eslintConfigPrettier,
  globals,
} from "./base.mjs";
import {
  createVitestConfig,
  vitestFilePatterns,
  vitestRules,
  vitest,
} from "./vitest.mjs";
import {
  createJestConfig,
  jestFilePatterns,
  jestRules,
  jest,
} from "./jest.mjs";

/**
 * Creates a complete ESLint flat config for TypeScript + Vitest projects
 * @param {Object} options - Configuration options
 * @param {string} options.tsconfigRootDir - Root directory for tsconfig.json (required - use import.meta.dirname)
 * @param {string[]} [options.vitestFiles] - Custom file patterns for Vitest (optional)
 * @param {import("eslint").Linter.Config[]} [options.additionalConfigs] - Additional configs to append
 * @returns {import("eslint").Linter.Config[]}
 */
export function createConfig(options) {
  const { tsconfigRootDir, vitestFiles, additionalConfigs = [] } = options;

  if (!tsconfigRootDir) {
    throw new Error(
      "tsconfigRootDir is required. Use import.meta.dirname in your eslint.config.mjs"
    );
  }

  return defineConfig(
    ...createBaseConfig({ tsconfigRootDir }),
    createVitestConfig({ files: vitestFiles }),
    ...additionalConfigs
  );
}

// Re-export everything for advanced usage
export {
  // Base exports
  createBaseConfig,
  defaultIgnores,
  typescriptRules,
  globalRules,
  nodeFetchGlobals,
  // Vitest exports
  createVitestConfig,
  vitestFilePatterns,
  vitestRules,
  // Jest exports
  createJestConfig,
  jestFilePatterns,
  jestRules,
  // Plugin exports
  eslint,
  tseslint,
  eslintConfigPrettier,
  globals,
  vitest,
  jest,
  // defineConfig for custom configurations
  defineConfig,
};
