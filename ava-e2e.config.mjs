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
    API_ENDPOINT: '<API_ENDPOINT>', // replace this. e.g. api.example.com (without scheme)
    SCHEME: '<SCHEME>', // replace this. e.g. https or http (defaults to https)
    CLIENT_API_KEY: '<CLIENT_API_KEY>', // replace this. Client SDK role API key
    SERVER_API_KEY: '<SERVER_API_KEY>', // replace this. Server SDK role API key for testing with local evaluate
  },
};
