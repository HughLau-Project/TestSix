import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tseslintParser from "@typescript-eslint/parser";
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {ignores: [
    'built/',
    'node_modules/',
    'src/*.test.ts',
    'src/*.d.ts'
  ]},  
  {languageOptions: { 
    globals: globals.browser,
    parser: tseslintParser,
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      project: './tsconfig.json',
      ecmaFeatures: {
        jsx: true,
      },
    },
  }},
  {plugins: {
    tseslint,
    importPlugin
  },settings: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },rules: {
    'class-methods-use-this': [1],
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        args: 'all',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    camelcase: 2,
    'no-mixed-spaces-and-tabs': 2,
    'max-len': [
      2,
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
      },
    ],
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];