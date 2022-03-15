module.exports = {
  plugins: ['jest'],
  extends: ['plugin:jest/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
