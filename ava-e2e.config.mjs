export default {
  babel: {
    testOptions: {
      babelrc: false,
      configFile: false,
    },
  },
  files: [
    '__e2e/__test__/*.js',
    '__e2e/__test__/local_evaluation/*.js'
  ],
  environmentVariables: {
    HOST: '<HOST>', // replace this. e.g. api-dev.bucketeer.jp
    TOKEN: '<TOKEN>', // replace this.
    SERVER_ROLE_TOKEN: '<SERVER_ROLE_TOKEN>', // replace this with the server role token for testing with local evaluate
  },
};
