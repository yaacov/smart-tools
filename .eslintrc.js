module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-constant-condition': 'off',
    'max-len': 'off',
    'no-bitwise': 'off',
    'no-return-assign': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'prefer-const': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'import/extensions': 'off',
  },
};
