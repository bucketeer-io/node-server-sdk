export default {
  failFast: true,
  failWithoutAssertions: false,
  babel: {
    testOptions: {
      babelrc: false,
      configFile: false,
    },
  },
  files: [
    '__test/**/__tests__/**/*.js',
    '!__test/**/__tests__/utils/**',
    '!__test/**/__tests__/testdata/**',
    '!__test/**/__tests__/mocks/**',
  ],
  "typescript": {
			"extensions": [
				"ts",
				"tsx"
			],
			"rewritePaths": {
				"src/": "build/"
			},
      "compile": "tsc"
		}
};
