import tsEslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import customRules from './eslint-rules/no-spread-after-defaults.mjs';

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts', '__test/**/*.ts', 'example/**/*.ts'],
    ignores: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        project: [`tsconfig.json`, `tsconfig.test.json`, `example/tsconfig.json`],
      },
      globals: {
        node: true,
      },
    },
    plugins: {
      ...tsEslint.configs.recommended,
      eslintPluginPrettierRecommended,
      'custom-rules': customRules,
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'custom-rules/no-spread-after-defaults': 'error',
    },
  },
];
