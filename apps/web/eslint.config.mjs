import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jestPlugin from 'eslint-plugin-jest';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  // you can also configure jest rules in other objects, so long as some of the `files` match
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    rules: { 'jest/prefer-expect-assertions': 'off' },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
]);

export default eslintConfig;
