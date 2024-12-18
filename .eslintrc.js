module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'unused-imports',
    'typescript-sort-keys',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': ['off', { singleQuote: true }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'linebreak-style': 0,
    'semi-spacing': 'error',
    eqeqeq: 'error',
    curly: 'error',
    'no-duplicate-imports': 'error',
    'no-console': ['warn', { allow: ['warn', 'error', 'clear'] }],
    'max-lines-per-function': [
      'warn',
      { max: 500, skipBlankLines: true, skipComments: true },
    ],
    'max-depth': ['warn', 2],
  },
};
