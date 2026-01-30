// @ts-check
import { describe, it, expect, assert } from "vitest";
import {
  createConfig,
  createVitestConfig,
  vitestFilePatterns,
  vitestRules,
  vitest,
} from "./vitest.mjs";

describe("createConfig (vitest)", () => {
  it("throws error when tsconfigRootDir is not provided", () => {
    // @ts-expect-error - Testing runtime error for missing required param
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
    // Should include vitest plugin
    const vitestConfig = configs.find((c) => c.plugins?.vitest);
    expect(vitestConfig).toBeDefined();
  });

  it("accepts custom vitest file patterns", () => {
    const customPatterns = ["**/*.spec.ts"];
    const configs = createConfig({
      tsconfigRootDir: "/test/dir",
      vitestFiles: customPatterns,
    });
    const vitestConfig = configs.find((c) => c.plugins?.vitest);
    assert(vitestConfig !== undefined, "vitestConfig should be defined");
    expect(vitestConfig.files).toEqual(customPatterns);
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

describe("createVitestConfig", () => {
  it("returns a config object", () => {
    const config = createVitestConfig();
    expect(typeof config).toBe("object");
  });

  it("uses default file patterns when none provided", () => {
    const config = createVitestConfig();
    expect(config.files).toEqual(vitestFilePatterns);
  });

  it("uses custom file patterns when provided", () => {
    const customPatterns = ["**/*.spec.ts"];
    const config = createVitestConfig({ files: customPatterns });
    expect(config.files).toEqual(customPatterns);
  });

  it("includes vitest plugin", () => {
    const config = createVitestConfig();
    expect(config.plugins?.vitest).toBeDefined();
  });

  it("includes vitest rules", () => {
    const config = createVitestConfig();
    assert(config.rules !== undefined, "rules should be defined");
    expect(config.rules["vitest/expect-expect"]).toBe("off");
  });

  it("includes vitest globals", () => {
    const config = createVitestConfig();
    const globals = /** @type {Record<string, unknown>} */ (
      config.languageOptions?.globals
    );
    expect(globals).toBeDefined();
    // Vitest globals should be present
    expect(globals.describe).toBe(true);
    expect(globals.it).toBe(true);
    expect(globals.expect).toBe(true);
  });

  it("includes vitest settings", () => {
    const config = createVitestConfig();
    const settings = /** @type {{ vitest?: { typecheck?: boolean } }} */ (
      config.settings
    );
    expect(settings?.vitest?.typecheck).toBe(true);
  });
});

describe("exports", () => {
  it("exports vitestFilePatterns", () => {
    expect(Array.isArray(vitestFilePatterns)).toBe(true);
    expect(vitestFilePatterns.length).toBeGreaterThan(0);
  });

  it("exports vitestRules", () => {
    expect(typeof vitestRules).toBe("object");
  });

  it("exports vitest plugin", () => {
    expect(vitest).toBeDefined();
  });
});
