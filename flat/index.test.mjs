// @ts-check
import { describe, it, expect, assert } from "vitest";
import {
  createConfig,
  createBaseConfig,
  createVitestConfig,
  createJestConfig,
  defaultIgnores,
  typescriptDisabledRules,
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
    assert(ignoreConfig !== undefined, "ignoreConfig should be defined");
    assert(ignoreConfig.ignores !== undefined, "ignores should be defined");
    expect(ignoreConfig.ignores).toContain("node_modules/");
    expect(ignoreConfig.ignores).toContain("dist/");
  });

  it("applies tsconfigRootDir when provided", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/custom/path" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    assert(
      tsConfig.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const parserOptions =
      /** @type {{ tsconfigRootDir?: string }} */ (
        tsConfig.languageOptions.parserOptions
      );
    expect(parserOptions.tsconfigRootDir).toBe("/custom/path");
  });

  it("works without tsconfigRootDir option", () => {
    const configs = createBaseConfig();
    expect(Array.isArray(configs)).toBe(true);
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    assert(
      tsConfig.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const parserOptions =
      /** @type {{ tsconfigRootDir?: string }} */ (
        tsConfig.languageOptions.parserOptions
      );
    expect(parserOptions.tsconfigRootDir).toBeUndefined();
  });

  it("includes TypeScript rules for ts files", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    expect(tsConfig.rules).toEqual(typescriptDisabledRules);
  });

  it("includes global rules", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const globalConfig = configs.find(
      (c) => c.rules?.["no-undef"] && !c.files
    );
    assert(globalConfig !== undefined, "globalConfig should be defined");
    assert(globalConfig.rules !== undefined, "rules should be defined");
    expect(globalConfig.rules["no-undef"]).toBe("error");
  });

  it("includes Node.js and fetch globals", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    assert(
      tsConfig.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const globals =
      /** @type {Record<string, unknown>} */ (tsConfig.languageOptions.globals);
    expect(globals.fetch).toBe("readonly");
    expect(globals.process).toBeDefined();
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
    assert(config.plugins !== undefined, "plugins should be defined");
    expect(config.plugins.vitest).toBeDefined();
  });

  it("includes vitest rules", () => {
    const config = createVitestConfig();
    assert(config.rules !== undefined, "rules should be defined");
    expect(config.rules["@typescript-eslint/no-non-null-assertion"]).toBe(
      "off"
    );
    expect(config.rules["@typescript-eslint/unbound-method"]).toBe("off");
  });

  it("includes vitest globals", () => {
    const config = createVitestConfig();
    assert(
      config.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const globals =
      /** @type {Record<string, unknown>} */ (config.languageOptions.globals);
    expect(globals.describe).toBeDefined();
    expect(globals.it).toBeDefined();
    expect(globals.expect).toBeDefined();
  });

  it("includes vitest settings", () => {
    const config = createVitestConfig();
    assert(config.settings !== undefined, "settings should be defined");
    const settings = /** @type {{ vitest: { typecheck: boolean } }} */ (
      config.settings
    );
    expect(settings.vitest.typecheck).toBe(true);
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
    assert(config.plugins !== undefined, "plugins should be defined");
    expect(config.plugins.jest).toBeDefined();
  });

  it("includes jest rules", () => {
    const config = createJestConfig();
    assert(config.rules !== undefined, "rules should be defined");
    expect(config.rules["@typescript-eslint/no-non-null-assertion"]).toBe(
      "off"
    );
    expect(config.rules["@typescript-eslint/unbound-method"]).toBe("off");
    expect(config.rules["jest/expect-expect"]).toBe("off");
  });

  it("includes jest globals", () => {
    const config = createJestConfig();
    assert(
      config.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const globals =
      /** @type {Record<string, unknown>} */ (config.languageOptions.globals);
    expect(globals.describe).toBe(false);
    expect(globals.it).toBe(false);
    expect(globals.expect).toBe(false);
    expect(globals.jest).toBe(false);
  });
});

describe("createConfig", () => {
  it("throws error when tsconfigRootDir is not provided", () => {
    // @ts-expect-error - Testing runtime error for missing required param
    expect(() => createConfig({})).toThrow("tsconfigRootDir is required");
  });

  it("returns an array of configs", () => {
    const configs = createConfig({ tsconfigRootDir: "/test/dir" });
    expect(Array.isArray(configs)).toBe(true);
  });

  it("includes only base config (no test framework)", () => {
    const configs = createConfig({ tsconfigRootDir: "/test/dir" });
    // Should have base configs only
    expect(configs.length).toBeGreaterThan(0);
    // Should NOT include vitest or jest plugins
    const vitestConfig = configs.find((c) => c.plugins?.vitest);
    const jestConfig = configs.find((c) => c.plugins?.jest);
    expect(vitestConfig).toBeUndefined();
    expect(jestConfig).toBeUndefined();
  });

  it("appends additional configs", () => {
    /** @type {import("eslint").Linter.Config} */
    const additionalConfig = { rules: { "no-console": "error" } };
    const configs = createConfig({
      tsconfigRootDir: "/test/dir",
      additionalConfigs: [additionalConfig],
    });
    const customConfig = configs.find((c) => c.rules?.["no-console"]);
    assert(customConfig !== undefined, "customConfig should be defined");
    assert(customConfig.rules !== undefined, "rules should be defined");
    expect(customConfig.rules["no-console"]).toBe("error");
  });
});

describe("exported constants", () => {
  it("exports defaultIgnores with expected patterns", () => {
    expect(defaultIgnores.ignores).toContain("node_modules/");
    expect(defaultIgnores.ignores).toContain("dist/");
    expect(defaultIgnores.ignores).toContain("coverage/");
  });

  it("exports typescriptDisabledRules", () => {
    expect(typescriptDisabledRules).toEqual({});
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
