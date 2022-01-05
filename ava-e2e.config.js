export default {
  babel: {
    testOptions: {
      babelrc: false,
      configFile: false,
    },
  },
  files: ['__e2e/__test__/*.js'],
  environmentVariables: {
    HOST: '<HOST>', // replace this. e.g. api-dev.bucketeer.jp
    TOKEN: '<TOKEN>', // replace this.
  },
};
