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

## Usage (ESLint 9 Flat Config - Recommended)

Create an `eslint.config.mjs` in your project root:

### Simple Usage

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### Custom Vitest File Patterns

```js
// eslint.config.mjs
import { createConfig } from "@jupiterone/eslint-config/flat";

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
  vitestFiles: [
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
  typescriptRules,
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
    rules: typescriptRules,
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

## Legacy Usage (ESLint 8 - Deprecated)

> **Note:** Legacy configuration is deprecated. Please migrate to ESLint 9 flat config.

**For Node.js apps targeting Node.js v18:**

```js
// .eslintrc
{
  "root": true,
  "extends": [
    "@jupiterone/eslint-config/node18"
  ],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  }
}
```

**Other Node.js versions:**

- `@jupiterone/eslint-config/node14` (ECMA version 2020)
- `@jupiterone/eslint-config/node16` (ECMA version 2021)
- `@jupiterone/eslint-config/node18` (ECMA version 2022)

**React configuration:**

```js
// .eslintrc
{
  "root": true,
  "extends": [
    "@jupiterone/eslint-config/react"
  ],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  }
}
```

## Test File Patterns

The Vitest configuration automatically applies to:

- `vitest.*.{ts,js}`
- `**/test/**/*.{ts,tsx,js,jsx}`
- `**/*.test.{ts,tsx,js,jsx}`
- `**/__mocks__/**/*.{ts,tsx,js,jsx}`

## TypeScript Rules

This config uses relaxed TypeScript rules to allow gradual adoption. The following rules are disabled by default:

- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-unsafe-*` rules
- `@typescript-eslint/explicit-function-return-type`
- And more (see `typescriptRules` export)

## Security

The `id-match` rule is enabled to prevent invisible character backdoors. See [The Invisible JavaScript Backdoor](https://certitude.consulting/blog/en/invisible-backdoor/) for more information.

## Migration from v3 to v4

1. Update your ESLint to v9+
2. Rename `.eslintrc` to `eslint.config.mjs`
3. Use the new flat config format as shown above
4. If using Jest, migrate to Vitest or keep using the legacy config
