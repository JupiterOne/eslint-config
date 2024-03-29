module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules/', 'dist/', 'work/', 'coverage/', '**/*.bak/'],
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/prefer-string-starts-ends-with': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // @typescript-eslint/no-unsafe-argument is causing erroneous errors
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },
    {
      files: [
        'jest.*.{ts,js}',
        'test/**/*.{ts,tsx,js,jsx}',
        '*.test.{ts,tsx,js,jsx}',
        '__mocks__/**/*.{ts,tsx,js,jsx}',
      ],
      extends: ['./jest'],
    },
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'error',
    'no-constant-condition': 'warn',
    // require identifiers to match a specified regular expression
    // https://eslint.org/docs/rules/id-match
    // The Invisible JavaScript Backdoor: https://certitude.consulting/blog/en/invisible-backdoor/
    'id-match': ['error', '^[a-zA-Z_]+[a-zA-Z0-9_]*$'],
  },
};
