# @jupiterone/eslint-config

This package provides the standard JupiterOne `eslint` configuration.

## Features

- ESLint 9 flat config support with TypeScript
- Vitest test file linting
- Prettier integration (disables conflicting rules)
- Security rules (prevents invisible character backdoors)
- Node.js 18+ Fetch API globals

## Installation

```sh
npm install @jupiterone/eslint-config --save-dev
```

## Import Paths

| Import Path | Description | Test Framework |
|-------------|-------------|----------------|
| `@jupiterone/eslint-config/flat` | Base config with no test framework | None (add manually) |
| `@jupiterone/eslint-config/flat/vitest` | Config with Vitest support (recommended) | Vitest |
| `@jupiterone/eslint-config/flat/jest` | Config with Jest support | Jest |

## React Support

For React/frontend projects, use [@jupiterone/eslint-plugin-jupiterone-frontend](https://github.com/JupiterOne/eslint-plugin-jupiterone-frontend) instead. This package is intended for Node.js backend services.

## Usage (ESLint 9 Flat Config - Recommended)

Create an `eslint.config.mjs` in your project root:

### With Vitest (Recommended)

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat/vitest";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### With Jest

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat/jest";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### Base Only (No Test Framework)

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### Custom Test File Patterns

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat/vitest";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
  vitestFiles: [
    "**/*.spec.{ts,tsx}",
    "**/__tests__/**/*.{ts,tsx}",
  ],
});
```

For Jest, use `jestFiles` instead:

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat/jest";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
  jestFiles: [
    "**/*.spec.{ts,tsx}",
    "**/__tests__/**/*.{ts,tsx}",
  ],
});
```

### Advanced Usage (Composing Configs)

```js
// eslint.config.mjs
import { defineConfig } from "eslint/config";
import {
  createBaseConfig,
  createVitestConfig,
} from "@jupiterone/eslint-config/flat";

export default defineConfig(
  ...createBaseConfig({ tsconfigRootDir: import.meta.dirname }),
  createVitestConfig(),
  // Add your custom rules
  {
    rules: {
      "no-console": "warn",
    },
  }
);
```

### Using Individual Exports

```js
// eslint.config.mjs
import { defineConfig } from "eslint/config";
import {
  eslint,
  tseslint,
  eslintConfigPrettier,
  globals,
  defaultIgnores,
  typescriptDisabledRules,
  globalRules,
  nodeFetchGlobals,
  vitest,
  vitestFilePatterns,
  vitestRules,
} from "@jupiterone/eslint-config/flat";

// Build your own config using the exported pieces
export default defineConfig(
  defaultIgnores,
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...nodeFetchGlobals,
      },
    },
    rules: typescriptDisabledRules,
  },
  {
    files: vitestFilePatterns,
    plugins: { vitest },
    rules: vitestRules,
    settings: { vitest: { typecheck: true } },
    languageOptions: {
      globals: {
        ...globals.node,
        ...nodeFetchGlobals,
        ...vitest.environments.env.globals,
      },
    },
  },
  { rules: globalRules }
);
```



## Test File Patterns

The Vitest configuration automatically applies to:

- `vitest.*.{ts,mts,cts,js,mjs,cjs}`
- `**/test/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`
- `**/*.test.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`
- `**/__tests__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`
- `**/__mocks__/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`

## TypeScript Rules

This config by default uses the upstream recommended typescript eslint rules: https://typescript-eslint.io/users/configs#projects-with-type-checking

## Security

The `id-match` rule is enabled to prevent invisible character backdoors. See [The Invisible JavaScript Backdoor](https://certitude.consulting/blog/en/invisible-backdoor/) for more information.

## Migration from v3 to v4

v4 introduces ESLint 9 flat config support and enables stricter TypeScript rules by default. This guide covers upgrading from the legacy `.eslintrc` format to the new flat config.

### Breaking Changes

| Change | v3 | v4 |
|--------|----|----|
| Config format | `.eslintrc` / `.eslintrc.js` | `eslint.config.mjs` |
| ESLint version | 8.x | 9.x |
| TypeScript rules | Relaxed (many rules disabled) | Strict (upstream recommended) |
| Test framework | Jest | Vitest (Jest also supported) |
| Entry point | `@jupiterone/eslint-config/node18` | `@jupiterone/eslint-config/flat/vitest` |

### Prerequisites

1. **Node.js 18+** is required
2. **ESLint 9.x** must be installed
3. **TypeScript 5.3+** is recommended

### Step 1: Update Dependencies

```sh
# Remove old ESLint 8 and legacy plugins
npm uninstall eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-react

# Install ESLint 9 and the new config
npm install eslint@^9 @jupiterone/eslint-config@^4 --save-dev
```

### Step 2: Replace Configuration File

Delete your old `.eslintrc`, `.eslintrc.js`, or `.eslintrc.json` file and create a new `eslint.config.mjs`:

**Before (v3 - `.eslintrc`):**
```json
{
  "root": true,
  "extends": ["@jupiterone/eslint-config/node18"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  }
}
```

**After (v4 - `eslint.config.mjs`):**
```js
import { createConfig } from "@jupiterone/eslint-config/flat";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### Step 3: Configuration Mapping

| v3 Extends | v4 Equivalent |
|------------|---------------|
| `@jupiterone/eslint-config/node14` | `createConfig()` (Node 18+ only) |
| `@jupiterone/eslint-config/node16` | `createConfig()` (Node 18+ only) |
| `@jupiterone/eslint-config/node18` | `createConfig()` |
| `@jupiterone/eslint-config/react` | Use [@jupiterone/eslint-plugin-jupiterone-frontend](https://github.com/JupiterOne/eslint-plugin-jupiterone-frontend) |

### Step 4: Handle Stricter TypeScript Rules

v4 enables the full [typescript-eslint recommended rules](https://typescript-eslint.io/users/configs#projects-with-type-checking) by default. If your codebase has many violations, you have two options:

**Option A: Fix violations (recommended)**

Run ESLint and fix errors incrementally:
```sh
npx eslint . --fix
```

**Option B: Disable specific rules temporarily**

Add rule overrides to your config:
```js
import { createConfig } from "@jupiterone/eslint-config/flat";

export default [
  ...createConfig({ tsconfigRootDir: import.meta.dirname }),
  {
    rules: {
      // Disable rules you're not ready to adopt
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
];
```

### Step 5: Migrate Test Configuration

**If using Vitest (recommended):**

```js
import { createConfig } from "@jupiterone/eslint-config/flat/vitest";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

**If using Jest:**

```js
import { createConfig } from "@jupiterone/eslint-config/flat/jest";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

**If not using a test framework:**

```js
import { createConfig } from "@jupiterone/eslint-config/flat";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### Step 6: Update npm Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Step 7: Update CI/CD

If you're using `eslint --ext .ts,.tsx`, remove the `--ext` flag as it's not supported in ESLint 9:

```diff
- eslint --ext .ts,.tsx src/
+ eslint src/
```

### Common Migration Issues

**Error: "parserOptions.project" not found**

The flat config uses `projectService` instead of `project`. This is handled automatically by `createConfig()`.

**Error: Cannot find module '@jupiterone/eslint-config/node18'**

The legacy entry points have been removed. Use `@jupiterone/eslint-config/flat` instead.

**Error: ESLintRC format detected**

Delete your `.eslintrc*` file. ESLint 9 uses `eslint.config.mjs` by default.

**Many new TypeScript errors appearing**

This is expected. v4 enables stricter rules. See Step 4 above for options.

### Full Migration Example

**Before (v3):**
```
project/
├── .eslintrc.json
├── package.json
└── src/
```

```json
// .eslintrc.json
{
  "root": true,
  "extends": ["@jupiterone/eslint-config/node18"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  },
  "rules": {
    "no-console": "warn"
  }
}
```

**After (v4):**
```
project/
├── eslint.config.mjs
├── package.json
└── src/
```

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat/vitest";

export default [
  ...createConfig({ tsconfigRootDir: import.meta.dirname }),
  {
    rules: {
      "no-console": "warn",
    },
  },
];
```
