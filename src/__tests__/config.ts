import test from 'ava';
import { defineBKTConfig, defaultConfig, Config } from '../config';
import { DefaultLogger } from '../logger';

// Test cases for defineBKTConfig function
const defineBKTConfigTestCases = [
  {
    name: 'applies all defaults when no optional fields provided',
    input: {
      host: 'api.bucketeer.io',
      token: 'test-token',
      tag: 'test-tag'
    } as Config,
    expected: {
      host: 'api.bucketeer.io',
      token: 'test-token',
      tag: 'test-tag',
      pollingIntervalForRegisterEvents: 60000,
      enableLocalEvaluation: false,
      cachePollingInterval: 60000,
      logger: defaultConfig.logger
    }
  },
  {
    name: 'applies defaults when undefined values are passed',
    input: {
      host: 'undefined.host.com',
      token: 'undefined-token',
      tag: 'undefined-tag',
      pollingIntervalForRegisterEvents: undefined,
      logger: undefined,
      enableLocalEvaluation: undefined,
      cachePollingInterval: undefined
    } as Config,
    expected: {
      host: 'undefined.host.com',
      token: 'undefined-token',
      tag: 'undefined-tag',
      pollingIntervalForRegisterEvents: 60000,
      enableLocalEvaluation: false,
      cachePollingInterval: 60000,
      logger: defaultConfig.logger
    }
  },
  {
    name: 'accepts empty string values',
    input: {
      host: '',
      token: '',
      tag: ''
    } as Config,
    expected: {
      host: '',
      token: '',
      tag: '',
      pollingIntervalForRegisterEvents: 60000,
      enableLocalEvaluation: false,
      cachePollingInterval: 60000,
      logger: defaultConfig.logger
    }
  },
  {
    name: 'uses provided values when all properties specified',
    input: {
      host: 'custom.host.com',
      token: 'custom-token',
      tag: 'custom-tag',
      pollingIntervalForRegisterEvents: 30000,
      logger: new DefaultLogger(),
      enableLocalEvaluation: true,
      cachePollingInterval: 120000
    } as Config,
    expected: {
      host: 'custom.host.com',
      token: 'custom-token',
      tag: 'custom-tag',
      pollingIntervalForRegisterEvents: 30000,
      enableLocalEvaluation: true,
      cachePollingInterval: 120000,
      customLogger: true
    }
  },
  {
    name: 'mixes provided and default values',
    input: {
      host: 'partial.host.com',
      token: 'partial-token',
      tag: 'partial-tag',
      enableLocalEvaluation: true
    } as Config,
    expected: {
      host: 'partial.host.com',
      token: 'partial-token',
      tag: 'partial-tag',
      pollingIntervalForRegisterEvents: 60000,
      enableLocalEvaluation: true,
      cachePollingInterval: 60000,
      logger: defaultConfig.logger
    }
  },
  {
    name: 'preserves zero values for intervals',
    input: {
      host: 'zero.host.com',
      token: 'zero-token',
      tag: 'zero-tag',
      pollingIntervalForRegisterEvents: 0,
      cachePollingInterval: 0
    } as Config,
    expected: {
      host: 'zero.host.com',
      token: 'zero-token',
      tag: 'zero-tag',
      pollingIntervalForRegisterEvents: 0,
      enableLocalEvaluation: false,
      cachePollingInterval: 0,
      logger: defaultConfig.logger
    }
  }
];

// Test each case
defineBKTConfigTestCases.forEach(testCase => {
  test(testCase.name, t => {
    const originalInput = { ...testCase.input };
    const result = defineBKTConfig(testCase.input);
    
    // Test immutability - input should remain unchanged
    t.deepEqual(testCase.input, originalInput);
    t.not(result, testCase.input);
    
    // Verify all properties match expected values
    t.is(result.host, testCase.expected.host);
    t.is(result.token, testCase.expected.token);
    t.is(result.tag, testCase.expected.tag);
    t.is(result.pollingIntervalForRegisterEvents, testCase.expected.pollingIntervalForRegisterEvents);
    t.is(result.enableLocalEvaluation, testCase.expected.enableLocalEvaluation);
    t.is(result.cachePollingInterval, testCase.expected.cachePollingInterval);
    
    // Logger property needs special handling since it's an object
    if (testCase.expected.customLogger) {
      // This test case uses a custom logger from the input
      t.is(result.logger, testCase.input.logger);
    } else {
      t.truthy(result.logger);
      t.is(typeof result.logger!.debug, 'function');
      t.is(typeof result.logger!.info, 'function');
      t.is(typeof result.logger!.warn, 'function');
      t.is(typeof result.logger!.error, 'function');
      t.is(result.logger!.constructor.name, 'DefaultLogger');
      t.is(result.logger, defaultConfig.logger); // Exact same instance
    }
  });
});
