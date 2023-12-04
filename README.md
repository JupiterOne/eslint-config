# @jupiterone/eslint-config

This package provides the standard JupiterOne `eslint` configuration.

This configuration extends the following:

- `eslint:recommended`
- `prettier`

It also provides linting support for TypeScript files via
`@typescript-eslint/parser`.

## Usage

**Install package:**

```sh
yarn add @jupiterone/eslint-config --dev
```

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

**NOTE:** You can also target other versions of Node.js by extending one of the
following configurations:

- `@jupiterone/eslint-config/node14` (ECMA version 2020)
- `@jupiterone/eslint-config/node16` (ECMA version 2021)
- `@jupiterone/eslint-config/node18` (ECMA version 2022)

**An experimental React configuration is also provided:**

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

**This package automatically applies `jest` liniting rules to the following
files:**

- `jest.*.js`
- `test/**/*.{ts,tsx,js,jsx}`
- `*.test.{ts,tsx,js,jsx}`
- `__mocks__/**/*.{ts,tsx,js,jsx}`
