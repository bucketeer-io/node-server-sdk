module.exports = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  overrides: [
    {
      files: '*.{yml,yaml}',
      options: {
        singleQuote: false,
      },
    },
  ],
};
