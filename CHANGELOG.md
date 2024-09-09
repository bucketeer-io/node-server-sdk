# Changelog

## [0.3.1](https://github.com/bucketeer-io/node-server-sdk/compare/node-server-sdk-v0.3.0...node-server-sdk-v0.3.1) (2024-09-05)


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
