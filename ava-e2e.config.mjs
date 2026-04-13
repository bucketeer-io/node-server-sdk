import 'dotenv/config'; // Loads .env file into process.env

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
    API_ENDPOINT: process.env.API_ENDPOINT || '<API_ENDPOINT>', // e.g. api.example.com (without scheme)
    SCHEME: process.env.SCHEME || '<SCHEME>', // e.g. https or http (defaults to https)
    CLIENT_API_KEY: process.env.CLIENT_API_KEY || '<CLIENT_API_KEY>', // Client SDK role API key
    SERVER_API_KEY: process.env.SERVER_API_KEY || '<SERVER_API_KEY>', // Server SDK role API key for testing with local evaluate
  },
};