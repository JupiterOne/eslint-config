// @ts-check
import { describe, it, expect } from "vitest";
import {
  createConfig,
  createBaseConfig,
  createVitestConfig,
  createJestConfig,
  defaultIgnores,
  typescriptRules,
  globalRules,
  nodeFetchGlobals,
  vitestFilePatterns,
  vitestRules,
  jestFilePatterns,
  jestRules,
} from "./index.mjs";

describe("createBaseConfig", () => {
  it("returns an array of config objects", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBeGreaterThan(0);
  });

  it("includes default ignores", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const ignoreConfig = configs.find((c) => c.ignores);
    expect(ignoreConfig).toBeDefined();
    expect(ignoreConfig.ignores).toContain("node_modules/");
    expect(ignoreConfig.ignores).toContain("dist/");
  });

  it("applies tsconfigRootDir when provided", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/custom/path" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    expect(tsConfig).toBeDefined();
    expect(tsConfig.languageOptions.parserOptions.tsconfigRootDir).toBe(
      "/custom/path"
    );
  });

  it("works without tsconfigRootDir option", () => {
    const configs = createBaseConfig();
    expect(Array.isArray(configs)).toBe(true);
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    expect(tsConfig.languageOptions.parserOptions.tsconfigRootDir).toBeUndefined();
  });

  it("includes TypeScript rules for ts files", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    expect(tsConfig).toBeDefined();
    expect(tsConfig.rules).toBeDefined();
    expect(tsConfig.rules["@typescript-eslint/no-explicit-any"]).toBe("off");
  });

  it("includes global rules", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const globalConfig = configs.find(
      (c) => c.rules?.["no-undef"] && !c.files
    );
    expect(globalConfig).toBeDefined();
    expect(globalConfig.rules["no-undef"]).toBe("error");
  });

  it("includes Node.js and fetch globals", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    expect(tsConfig.languageOptions.globals).toBeDefined();
    expect(tsConfig.languageOptions.globals.fetch).toBe("readonly");
    expect(tsConfig.languageOptions.globals.process).toBeDefined();
  });
});

describe("createVitestConfig", () => {
  it("returns a config object", () => {
    const config = createVitestConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  it("uses default file patterns when none provided", () => {
    const config = createVitestConfig();
    expect(config.files).toEqual(vitestFilePatterns);
    expect(config.files).toContain("**/*.test.{ts,tsx,js,jsx}");
  });

  it("uses custom file patterns when provided", () => {
    const customPatterns = ["**/*.spec.ts", "**/__tests__/**/*.ts"];
    const config = createVitestConfig({ files: customPatterns });
    expect(config.files).toEqual(customPatterns);
  });

  it("includes vitest plugin", () => {
    const config = createVitestConfig();
    expect(config.plugins).toBeDefined();
    expect(config.plugins.vitest).toBeDefined();
  });

  it("includes vitest rules", () => {
    const config = createVitestConfig();
    expect(config.rules).toBeDefined();
    expect(config.rules["@typescript-eslint/no-non-null-assertion"]).toBe("off");
    expect(config.rules["@typescript-eslint/unbound-method"]).toBe("off");
  });

  it("includes vitest globals", () => {
    const config = createVitestConfig();
    expect(config.languageOptions.globals).toBeDefined();
    expect(config.languageOptions.globals.describe).toBeDefined();
    expect(config.languageOptions.globals.it).toBeDefined();
    expect(config.languageOptions.globals.expect).toBeDefined();
  });

  it("includes vitest settings", () => {
    const config = createVitestConfig();
    expect(config.settings).toBeDefined();
    expect(config.settings.vitest.typecheck).toBe(true);
  });
});

describe("createJestConfig", () => {
  it("returns a config object", () => {
    const config = createJestConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  it("uses default file patterns when none provided", () => {
    const config = createJestConfig();
    expect(config.files).toEqual(jestFilePatterns);
    expect(config.files).toContain("**/*.test.{ts,tsx,js,jsx}");
    expect(config.files).toContain("**/__tests__/**/*.{ts,tsx,js,jsx}");
  });

  it("uses custom file patterns when provided", () => {
    const customPatterns = ["**/*.spec.ts", "tests/**/*.ts"];
    const config = createJestConfig({ files: customPatterns });
    expect(config.files).toEqual(customPatterns);
  });

  it("includes jest plugin", () => {
    const config = createJestConfig();
    expect(config.plugins).toBeDefined();
    expect(config.plugins.jest).toBeDefined();
  });

  it("includes jest rules", () => {
    const config = createJestConfig();
    expect(config.rules).toBeDefined();
    expect(config.rules["@typescript-eslint/no-non-null-assertion"]).toBe("off");
    expect(config.rules["@typescript-eslint/unbound-method"]).toBe("off");
    expect(config.rules["jest/expect-expect"]).toBe("off");
  });

  it("includes jest globals", () => {
    const config = createJestConfig();
    expect(config.languageOptions.globals).toBeDefined();
    expect(config.languageOptions.globals.describe).toBe(false);
    expect(config.languageOptions.globals.it).toBe(false);
    expect(config.languageOptions.globals.expect).toBe(false);
    expect(config.languageOptions.globals.jest).toBe(false);
  });
});

describe("createConfig", () => {
  it("throws error when tsconfigRootDir is not provided", () => {
    expect(() => createConfig({})).toThrow("tsconfigRootDir is required");
  });

  it("returns an array of configs", () => {
    const configs = createConfig({ tsconfigRootDir: "/test/dir" });
    expect(Array.isArray(configs)).toBe(true);
  });

  it("includes base config and vitest config", () => {
    const configs = createConfig({ tsconfigRootDir: "/test/dir" });
    // Should have multiple configs from base + vitest
    expect(configs.length).toBeGreaterThan(1);
  });

  it("accepts custom vitest file patterns", () => {
    const customPatterns = ["**/*.spec.ts"];
    const configs = createConfig({
      tsconfigRootDir: "/test/dir",
      vitestFiles: customPatterns,
    });
    const vitestConfig = configs.find((c) => c.plugins?.vitest);
    expect(vitestConfig.files).toEqual(customPatterns);
  });

  it("appends additional configs", () => {
    const additionalConfig = { rules: { "no-console": "error" } };
    const configs = createConfig({
      tsconfigRootDir: "/test/dir",
      additionalConfigs: [additionalConfig],
    });
    const customConfig = configs.find((c) => c.rules?.["no-console"]);
    expect(customConfig).toBeDefined();
    expect(customConfig.rules["no-console"]).toBe("error");
  });
});

describe("exported constants", () => {
  it("exports defaultIgnores with expected patterns", () => {
    expect(defaultIgnores.ignores).toContain("node_modules/");
    expect(defaultIgnores.ignores).toContain("dist/");
    expect(defaultIgnores.ignores).toContain("coverage/");
  });

  it("exports typescriptRules with relaxed rules", () => {
    expect(typescriptRules["@typescript-eslint/no-explicit-any"]).toBe("off");
    expect(typescriptRules["@typescript-eslint/no-unused-vars"]).toBe("off");
  });

  it("exports globalRules with security rules", () => {
    expect(globalRules["no-undef"]).toBe("error");
    expect(globalRules["id-match"]).toBeDefined();
  });

  it("exports nodeFetchGlobals", () => {
    expect(nodeFetchGlobals.fetch).toBe("readonly");
    expect(nodeFetchGlobals.Response).toBe("readonly");
    expect(nodeFetchGlobals.Headers).toBe("readonly");
  });

  it("exports vitestFilePatterns", () => {
    expect(Array.isArray(vitestFilePatterns)).toBe(true);
    expect(vitestFilePatterns).toContain("**/*.test.{ts,tsx,js,jsx}");
  });

  it("exports vitestRules", () => {
    expect(vitestRules["vitest/expect-expect"]).toBe("off");
  });

  it("exports jestFilePatterns", () => {
    expect(Array.isArray(jestFilePatterns)).toBe(true);
    expect(jestFilePatterns).toContain("**/*.test.{ts,tsx,js,jsx}");
    expect(jestFilePatterns).toContain("**/__tests__/**/*.{ts,tsx,js,jsx}");
  });

  it("exports jestRules", () => {
    expect(jestRules["jest/expect-expect"]).toBe("off");
  });
});
