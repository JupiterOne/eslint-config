import { describe, it, expect, assert } from "vitest";
import {
  createBaseConfig,
  nodeFetchGlobals,
  defaultIgnores,
  typescriptDisabledRules,
  typescriptRecommendedRules,
  globalRules,
  eslint,
  tseslint,
  eslintConfigPrettier,
  globals,
} from "./base.mjs";

describe("nodeFetchGlobals", () => {
  it("exports fetch API globals as readonly", () => {
    expect(nodeFetchGlobals.fetch).toBe("readonly");
    expect(nodeFetchGlobals.Request).toBe("readonly");
    expect(nodeFetchGlobals.RequestInfo).toBe("readonly");
    expect(nodeFetchGlobals.RequestInit).toBe("readonly");
    expect(nodeFetchGlobals.Response).toBe("readonly");
    expect(nodeFetchGlobals.Headers).toBe("readonly");
    expect(nodeFetchGlobals.FormData).toBe("readonly");
  });

  it("contains exactly 7 fetch globals", () => {
    expect(Object.keys(nodeFetchGlobals)).toHaveLength(7);
  });
});

describe("defaultIgnores", () => {
  it("exports ignores with expected patterns", () => {
    assert(defaultIgnores.ignores !== undefined, "ignores should be defined");
    expect(defaultIgnores.ignores).toContain("node_modules/");
    expect(defaultIgnores.ignores).toContain("dist/");
    expect(defaultIgnores.ignores).toContain("work/");
    expect(defaultIgnores.ignores).toContain("coverage/");
    expect(defaultIgnores.ignores).toContain("**/*.bak/");
  });
});

describe("typescriptDisabledRules", () => {
  it("exports an empty object by default", () => {
    expect(typescriptDisabledRules).toEqual({});
  });
});

describe("typescriptRecommendedRules", () => {
  it("exports an array of configs", () => {
    expect(Array.isArray(typescriptRecommendedRules)).toBe(true);
    expect(typescriptRecommendedRules.length).toBeGreaterThan(0);
  });

  it("includes typescript-eslint recommended configs", () => {
    // Should contain configs from tseslint
    const hasTypeScriptConfig = typescriptRecommendedRules.some(
      (config) => config.name?.includes("typescript") || config.rules
    );
    expect(hasTypeScriptConfig).toBe(true);
  });
});

describe("globalRules", () => {
  it("disables no-unused-vars", () => {
    expect(globalRules["no-unused-vars"]).toBe("off");
  });

  it("enables no-undef as error", () => {
    expect(globalRules["no-undef"]).toBe("error");
  });

  it("sets no-constant-condition to warn", () => {
    expect(globalRules["no-constant-condition"]).toBe("warn");
  });

  it("includes id-match rule for security", () => {
    expect(globalRules["id-match"]).toBeDefined();
    expect(globalRules["id-match"]).toEqual([
      "error",
      "^(_|[a-zA-Z_][a-zA-Z0-9_]*)$",
    ]);
  });
});

describe("createBaseConfig", () => {
  it("returns an array of config objects", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBeGreaterThan(0);
  });

  it("includes default ignores as first config", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const ignoreConfig = configs.find((c) => c.ignores);
    assert(ignoreConfig !== undefined, "ignoreConfig should be defined");
    expect(ignoreConfig).toEqual(defaultIgnores);
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

  it("includes TypeScript config with typescriptDisabledRules", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    expect(tsConfig.rules).toEqual(typescriptDisabledRules);
  });

  it("includes global rules config", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    // The global rules config is the last config with just rules (no files)
    const globalConfig = configs.find(
      (c) => c.rules?.["id-match"] && !c.files
    );
    assert(globalConfig !== undefined, "globalConfig should be defined");
    expect(globalConfig.rules).toEqual(globalRules);
  });

  it("includes Node.js and fetch globals in TypeScript config", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    assert(
      tsConfig.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const configGlobals =
      /** @type {Record<string, unknown>} */ (tsConfig.languageOptions.globals);
    // Check fetch globals
    expect(configGlobals.fetch).toBe("readonly");
    expect(configGlobals.Response).toBe("readonly");
    // Check Node.js globals
    expect(configGlobals.process).toBeDefined();
  });

  it("enables projectService in parser options", () => {
    const configs = createBaseConfig({ tsconfigRootDir: "/test/dir" });
    const tsConfig = configs.find((c) => c.files?.includes("**/*.{ts,tsx}"));
    assert(tsConfig !== undefined, "tsConfig should be defined");
    assert(
      tsConfig.languageOptions !== undefined,
      "languageOptions should be defined"
    );
    const parserOptions =
      /** @type {{ projectService?: boolean }} */ (
        tsConfig.languageOptions.parserOptions
      );
    expect(parserOptions.projectService).toBe(true);
  });
});

describe("re-exported modules", () => {
  it("exports eslint", () => {
    expect(eslint).toBeDefined();
    expect(eslint.configs).toBeDefined();
    expect(eslint.configs.recommended).toBeDefined();
  });

  it("exports tseslint", () => {
    expect(tseslint).toBeDefined();
    expect(tseslint.configs).toBeDefined();
  });

  it("exports eslintConfigPrettier", () => {
    expect(eslintConfigPrettier).toBeDefined();
  });

  it("exports globals", () => {
    expect(globals).toBeDefined();
    expect(globals.node).toBeDefined();
    expect(globals.browser).toBeDefined();
  });
});
