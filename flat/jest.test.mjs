import { describe, it, expect, assert } from "vitest";
import {
  createConfig,
  createJestConfig,
  jestFilePatterns,
  jestRules,
  jest,
} from "./jest.mjs";

describe("createConfig (jest)", () => {
  it("throws error when tsconfigRootDir is not provided", () => {
    // @ts-expect-error - Testing runtime error for missing required param
    expect(() => createConfig({})).toThrow("tsconfigRootDir is required");
  });

  it("returns an array of configs", () => {
    const configs = createConfig({ tsconfigRootDir: "/test/dir" });
    expect(Array.isArray(configs)).toBe(true);
  });

  it("includes base config and jest config", () => {
    const configs = createConfig({ tsconfigRootDir: "/test/dir" });
    // Should have multiple configs from base + jest
    expect(configs.length).toBeGreaterThan(1);
    // Should include jest plugin
    const jestConfig = configs.find((c) => c.plugins?.jest);
    expect(jestConfig).toBeDefined();
  });

  it("accepts custom jest file patterns", () => {
    const customPatterns = ["**/*.spec.ts"];
    const configs = createConfig({
      tsconfigRootDir: "/test/dir",
      jestFiles: customPatterns,
    });
    const jestConfig = configs.find((c) => c.plugins?.jest);
    assert(jestConfig !== undefined, "jestConfig should be defined");
    expect(jestConfig.files).toEqual(customPatterns);
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

describe("createJestConfig", () => {
  it("returns a config object", () => {
    const config = createJestConfig();
    expect(typeof config).toBe("object");
  });

  it("uses default file patterns when none provided", () => {
    const config = createJestConfig();
    expect(config.files).toEqual(jestFilePatterns);
  });

  it("uses custom file patterns when provided", () => {
    const customPatterns = ["**/*.spec.ts"];
    const config = createJestConfig({ files: customPatterns });
    expect(config.files).toEqual(customPatterns);
  });

  it("includes jest plugin", () => {
    const config = createJestConfig();
    expect(config.plugins?.jest).toBeDefined();
  });

  it("includes jest rules", () => {
    const config = createJestConfig();
    assert(config.rules !== undefined, "rules should be defined");
    expect(config.rules["jest/expect-expect"]).toBe("off");
  });

  it("includes jest globals", () => {
    const config = createJestConfig();
    const globals = /** @type {Record<string, unknown>} */ (
      config.languageOptions?.globals
    );
    expect(globals).toBeDefined();
    // Jest globals should be present
    expect(globals.describe).toBe(false);
    expect(globals.it).toBe(false);
    expect(globals.expect).toBe(false);
    expect(globals.jest).toBe(false);
  });
});

describe("exports", () => {
  it("exports jestFilePatterns", () => {
    expect(Array.isArray(jestFilePatterns)).toBe(true);
    expect(jestFilePatterns.length).toBeGreaterThan(0);
  });

  it("exports jestRules", () => {
    expect(typeof jestRules).toBe("object");
  });

  it("exports jest plugin", () => {
    expect(jest).toBeDefined();
  });
});
