export default {
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
