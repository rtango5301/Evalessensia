import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      // Allow unescaped quotes in JSX text content
      'react/no-unescaped-entities': 'off',
      // Downgrade unused vars to warnings
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]);

export default eslintConfig;
