[![npm version](https://badge.fury.io/js/@bucketeer%2Fnode-server-sdk.svg)](https://badge.fury.io/js/@bucketeer%2Fnode-server-sdk)

# Bucketeer Server-Side SDK for Node.js

[Bucketeer](https://bucketeer.io) is an open-source platform created by [CyberAgent](https://www.cyberagent.co.jp/en) to help teams make better decisions, reduce deployment lead time and release risk through feature flags. Bucketeer offers advanced features like dark launches and staged rollouts that perform limited releases based on user attributes, devices, and other segments.

[Getting started](https://docs.bucketeer.io/getting-started) using Bucketeer SDK.

## Installation

See our [documentation](https://docs.bucketeer.io/sdk/server-side/node-js) to install the SDK.

## Contributing

We would ❤️ for you to contribute to Bucketeer and help improve it! Anyone can use and enjoy it!

Please follow our contribution guide [here](https://docs.bucketeer.io/contribution-guide/contributing).

## Example

Before building the example, please follow the following steps.

- Ensure that you have the `yarn` installed.
- Configure the `host` and the `token` info in the [index.ts](https://github.com/bucketeer-io/node-server-sdk/blob/master/example/src/index.ts#L15-L19).
- Move to the example directory `cd example`.
- Install dependencies `make init`.

### Build and start an example server

```bash
make start
```

If you want to use a published SDK instead of a local one, replace the line where it imports the library in the [example code](https://github.com/bucketeer-io/node-server-sdk/blob/master/example/src/index.ts#L7-L8)

## Development

### Setup

Install the prerequisite tools.

- [nvm](https://github.com/nvm-sh/nvm)
- [Yarn](https://yarnpkg.com/en/docs/install)

#### Setup node version

Please look at the [.nvmrc](./.nvmrc) file to check the node version.

```bash
nvm use
```

#### Install dependencies

```bash
make init
```

### SDK

#### Format

```bash
make fmt
```

#### Lint & Type check

```bash
make lint
make type-check
```

#### Build

```bash
make build
```

#### Run unit tests

```bash
make test
```

#### Run e2e tests

Configure the `host` and the `token` info in the [ava-e2e.config.mjs](./ava-e2e.config.mjs), then run the following command.

```bash
make e2e
```

### Publish to npm

Add the version field to [package.json](./package.json), then run the following command.

```bash
export NPM_TOKEN=<YOUR_NPM_TOKEN>
make publish
```

### Write tests
- Write tests in the `src/__tests__` directory. The test files should have the `.test.ts` suffix, following snake_case naming convention. Its differ from the library code which uses camelCase.
- Use `ava` as the test runner. You can find the configuration in the [ava.config.mjs](./ava.config.mjs) file.
- Run all tests using `make test` command.
- Run single test using `make test-single <path-to-test-file>` command.

**Note:** The publishing process is automated using [GitHub Actions](https://github.com/bucketeer-io/node-server-sdk/blob/master/.github/workflows/release.yml)https://github.com/bucketeer-io/node-server-sdk/blob/master/.github/workflows/release.yml to publish it when the released tag is created.
