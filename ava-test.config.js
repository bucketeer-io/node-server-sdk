export default {
  babel: {
    testOptions: {
      babelrc: false,
      configFile: false,
    },
  },
  require: ['./tools/ava/setupWindow'],
  files: ['__test/**/__tests__/*.js'],
};
