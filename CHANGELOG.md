# Changelog

## [0.4.0](https://github.com/bucketeer-io/node-server-sdk/compare/v0.3.3...v0.4.0) (2025-01-28)


### Features

* enable local evaluation ([#79](https://github.com/bucketeer-io/node-server-sdk/issues/79)) ([d2e5a2f](https://github.com/bucketeer-io/node-server-sdk/commit/d2e5a2f1faf3e50d1b38172a66ecc4c1972ad075))


### Bug Fixes

* evaluation event being reported with no user ID ([#89](https://github.com/bucketeer-io/node-server-sdk/issues/89)) ([a59a36b](https://github.com/bucketeer-io/node-server-sdk/commit/a59a36bbbee440a2bd43b2c5a51cb38385ee944f))


### Build System

* **deps:** bump the dependencies group with 14 updates ([#88](https://github.com/bucketeer-io/node-server-sdk/issues/88)) ([0ba9617](https://github.com/bucketeer-io/node-server-sdk/commit/0ba961796373d934484c64708bb16ff2d3318e27))

## [0.3.3](https://github.com/bucketeer-io/node-server-sdk/compare/v0.3.2...v0.3.3) (2024-12-03)


### Bug Fixes

* skip generating error events for unauthorized or forbidden errors ([#82](https://github.com/bucketeer-io/node-server-sdk/issues/82)) ([9b38eca](https://github.com/bucketeer-io/node-server-sdk/commit/9b38eca0327588a31ba4b327ad2b215c0b63c04a))


### Build System

* **deps:** bump the dependencies group with 12 updates ([#84](https://github.com/bucketeer-io/node-server-sdk/issues/84)) ([366be07](https://github.com/bucketeer-io/node-server-sdk/commit/366be07297ab9ab6028feda7c7b339369e9d949c))

## [0.3.2](https://github.com/bucketeer-io/node-server-sdk/compare/v0.3.1...v0.3.2) (2024-11-19)


### Miscellaneous

* change objectVariation implementation for consistency ([#80](https://github.com/bucketeer-io/node-server-sdk/issues/80)) ([7fadef7](https://github.com/bucketeer-io/node-server-sdk/commit/7fadef7df52a18b3fa3890a80bc2aad00afa27f8))


### Build System

* **deps:** bump the dependencies group with 13 updates ([#76](https://github.com/bucketeer-io/node-server-sdk/issues/76)) ([914ace5](https://github.com/bucketeer-io/node-server-sdk/commit/914ace508b5fd832a3e332e32268c50c420d1e8f))
* **deps:** bump the dependencies group with 17 updates ([#81](https://github.com/bucketeer-io/node-server-sdk/issues/81)) ([006a839](https://github.com/bucketeer-io/node-server-sdk/commit/006a839919386f9e1926bb947c6632bfe3c4d6a1))

## [0.3.1](https://github.com/bucketeer-io/node-server-sdk/compare/v0.3.0...v0.3.1) (2024-09-05)


### Features

* new detailed evaluation interface ([#70](https://github.com/bucketeer-io/node-server-sdk/issues/70)) ([99a28e9](https://github.com/bucketeer-io/node-server-sdk/commit/99a28e9a9058166a7a6146b2cd87d3780403d51a))


### Bug Fixes

* fail while checking if error is an instance of InvalidStatusError ([#61](https://github.com/bucketeer-io/node-server-sdk/issues/61)) ([7dd262a](https://github.com/bucketeer-io/node-server-sdk/commit/7dd262a894461a677f84eb9b5adacc3f74341a09))


### Miscellaneous

* add the source ID and sdk version to the register events API ([#58](https://github.com/bucketeer-io/node-server-sdk/issues/58)) ([b4d9b3b](https://github.com/bucketeer-io/node-server-sdk/commit/b4d9b3b9224154575a4229c30d0aef9ab77ddef2))
* update error metrics report ([#59](https://github.com/bucketeer-io/node-server-sdk/issues/59)) ([14c758c](https://github.com/bucketeer-io/node-server-sdk/commit/14c758cb047e6c6b7b0c58b01d1e4c6d66fe1db2))


### Build System

* **deps:** bump the dependencies ([#73](https://github.com/bucketeer-io/node-server-sdk/issues/73)) ([7c5aadd](https://github.com/bucketeer-io/node-server-sdk/commit/7c5aadd9a3ad7246e141e068c7f6d09e850230f6))


## 0.3.0 (2023-07-03)


### Features

* add node server side SDK ([ece2ef3](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/ece2ef3df0142b810e782669d34965a844f84a4f))


### Bug Fixes

* **config:** port is not optional ([ea9dad1](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/ea9dad1755a4217832d04e8deefce98359809f17))
* status error 400 ([#17](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/17)) ([95323c8](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/95323c864de24220fa6e8261b4177074bc9fb3e0))


### Miscellaneous

* add client interface to request without grpc depencies ([#9](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/9)) ([f63bbcf](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/f63bbcf859da06cff5d0a3171ef1864c79794c4a))
* **example:** add the published sdk to dependencies ([de9aa4e](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/de9aa4e127c956828b7fcff0d62d34b60a95e6c0))
* remove grpc dependencies ([#13](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/13)) ([6e31646](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/6e31646439350beb8471b31587333dfa19cdc2a0))
* **src:** add docs to exported interfaces ([f87004f](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/f87004f68531c6f646602cc6c728b5d38134880d))
* support LatencySecond field ([#15](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/15)) ([64f2305](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/64f2305a00de4ecf51174ba51fd2a4879cd376c1))
* support new metrics events ([#14](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/14)) ([d84da30](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/d84da308a967ca72ee4eff8ef1ce269226af1426))
* use content-length header for SizeMetricsEvent ([#16](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/16)) ([583945f](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/583945f398f97bb3f05caa8c7168bd6fe1f33be2))
* use new interface instead of grpc ([#12](https://github.com/ca-dp/bucketeer-node-server-sdk/issues/12)) ([3cf43bd](https://github.com/ca-dp/bucketeer-node-server-sdk/commit/3cf43bdf1a111e119df4ebc2a0706f80f8c674e2))
