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
};