module.exports = {
  extends: [
    'eslint:recommended',
    "plugin:prettier/recommended"
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: [`${__dirname}/tsconfig.json`, `${__dirname}/tsconfig.test.json`],
  },
  env: {
    node: true,
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    'no-unused-vars': 0,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-dupe-class-members': 0,
        'no-undef': 'off',
      },
    },
  ],
};
