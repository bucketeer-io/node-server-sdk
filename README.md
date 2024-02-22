[![npm version](https://badge.fury.io/js/@bucketeer%2Fnode-server-sdk.svg)](https://badge.fury.io/js/@bucketeer%2Fnode-server-sdk)

# Bucketeer Server-Side SDK for Node.js

## Table of Contents

 * [Installation](#installation)
 * [Example](#example)
 * [Documentation](#documentation)
 * [Contributing](#contributing)
 * [Development](#development)

## Installation

The Bucketeer server-side SDK for Node.js is available on npm as `@bucketeer/node-server-sdk`:

```bash
$ npm install --save @bucketeer/node-server-sdk
```

## Example

Before building an example, you need some setups.

- Replace placeholders in [index.ts](./example/src/index.ts)
- Move to example directory. `cd example`
- Install dependencies. `make init`

Build and start example server.

```bash
make start
```

If you want to use published SDK instead of local one, see `NOTE:` in [the example code](./example/src/index.ts)

## Documentation

- [Tutorial](https://bucketeer.io/docs/#/./server-side-sdk-tutorial-node)
- [Integration](https://bucketeer.io/docs/#/./server-side-sdk-reference-guides-node)

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md)

## Development

### Setup

Install prerequisite tools.

- [nvm](https://github.com/nvm-sh/nvm)
- [Yarn](https://yarnpkg.com/en/docs/install)

Setup node version.

```bash
nvm use
```

Setup npm token.

```bash
export NPM_TOKEN=<YOUR_NPM_TOKEN>
```

Install dependencies.

```bash
make init
```


### SDK

Format.

```bash
make fmt
```

Lint.

```bash
make lint
```

Build.

```bash
make build
```

Run unit tests.

```bash
make test
```

Run e2e tests.
First, replace placeholders in [ava-e2e.config.mjs](./ava-e2e.config.mjs), then run the command below.

```bash
make e2e
```

Publish to npm.
First, add version field to [package.json](./package.json), then run the command below.
(Usually you don't need to publish manually because CI/CD workflow publishes automatically.)

```bash
make publish
```
