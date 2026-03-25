import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['js/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        ...globals.vitest,
        dateFns: 'readonly',
        dateFnsTz: 'readonly',
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['tests/**/*.js'],
    rules: {
      'no-empty': 'off',
      'no-unused-vars': 'off',
    },
  },
];
