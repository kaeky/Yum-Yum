module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};
