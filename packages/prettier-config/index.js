export default {
  arrowParens: 'always',
  semi: false,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  endOfLine: 'lf',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^node:(.*)$',
    '^react$',
    '^react-dom(/.*)?$',
    '^react/(.*)$',
    '^next(/.*)?$',
    '<THIRD_PARTY_MODULES>',
    '^@repo/(.*)$',
    '^@/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
