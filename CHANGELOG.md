# Changelog

## [0.3.1](https://github.com/bucketeer-io/node-server-sdk/compare/node-server-sdk-v0.3.0...node-server-sdk-v0.3.1) (2024-09-05)


### Features

* add node server side SDK ([ece2ef3](https://github.com/bucketeer-io/node-server-sdk/commit/ece2ef3df0142b810e782669d34965a844f84a4f))
* new detailed evaluation interface ([#70](https://github.com/bucketeer-io/node-server-sdk/issues/70)) ([99a28e9](https://github.com/bucketeer-io/node-server-sdk/commit/99a28e9a9058166a7a6146b2cd87d3780403d51a))


### Bug Fixes

* **config:** port is not optional ([ea9dad1](https://github.com/bucketeer-io/node-server-sdk/commit/ea9dad1755a4217832d04e8deefce98359809f17))
* fail to check if error is instance of InvalidStatusError ([#61](https://github.com/bucketeer-io/node-server-sdk/issues/61)) ([7dd262a](https://github.com/bucketeer-io/node-server-sdk/commit/7dd262a894461a677f84eb9b5adacc3f74341a09))
* status error 400 ([#17](https://github.com/bucketeer-io/node-server-sdk/issues/17)) ([95323c8](https://github.com/bucketeer-io/node-server-sdk/commit/95323c864de24220fa6e8261b4177074bc9fb3e0))


### Miscellaneous

* add client interface to request without grpc depencies ([#9](https://github.com/bucketeer-io/node-server-sdk/issues/9)) ([f63bbcf](https://github.com/bucketeer-io/node-server-sdk/commit/f63bbcf859da06cff5d0a3171ef1864c79794c4a))
* add codeowners file ([#22](https://github.com/bucketeer-io/node-server-sdk/issues/22)) ([89145cd](https://github.com/bucketeer-io/node-server-sdk/commit/89145cdddfbcb670448b5c0d3f892c76723a8676))
* add the source ID and sdk version to the register events API ([#58](https://github.com/bucketeer-io/node-server-sdk/issues/58)) ([b4d9b3b](https://github.com/bucketeer-io/node-server-sdk/commit/b4d9b3b9224154575a4229c30d0aef9ab77ddef2))
* **example:** add the published sdk to dependencies ([de9aa4e](https://github.com/bucketeer-io/node-server-sdk/commit/de9aa4e127c956828b7fcff0d62d34b60a95e6c0))
* **master:** release 0.3.0 ([#11](https://github.com/bucketeer-io/node-server-sdk/issues/11)) ([fab15a6](https://github.com/bucketeer-io/node-server-sdk/commit/fab15a67407b0f9ea7ec4601a31f22b0f7e14881))
* remove grpc dependencies ([#13](https://github.com/bucketeer-io/node-server-sdk/issues/13)) ([6e31646](https://github.com/bucketeer-io/node-server-sdk/commit/6e31646439350beb8471b31587333dfa19cdc2a0))
* **src:** add docs to exported interfaces ([f87004f](https://github.com/bucketeer-io/node-server-sdk/commit/f87004f68531c6f646602cc6c728b5d38134880d))
* support LatencySecond field ([#15](https://github.com/bucketeer-io/node-server-sdk/issues/15)) ([64f2305](https://github.com/bucketeer-io/node-server-sdk/commit/64f2305a00de4ecf51174ba51fd2a4879cd376c1))
* support new metrics events ([#14](https://github.com/bucketeer-io/node-server-sdk/issues/14)) ([d84da30](https://github.com/bucketeer-io/node-server-sdk/commit/d84da308a967ca72ee4eff8ef1ce269226af1426))
* update error metrics report ([#59](https://github.com/bucketeer-io/node-server-sdk/issues/59)) ([14c758c](https://github.com/bucketeer-io/node-server-sdk/commit/14c758cb047e6c6b7b0c58b01d1e4c6d66fe1db2))
* use content-length header for SizeMetricsEvent ([#16](https://github.com/bucketeer-io/node-server-sdk/issues/16)) ([583945f](https://github.com/bucketeer-io/node-server-sdk/commit/583945f398f97bb3f05caa8c7168bd6fe1f33be2))
* use new interface instead of grpc ([#12](https://github.com/bucketeer-io/node-server-sdk/issues/12)) ([3cf43bd](https://github.com/bucketeer-io/node-server-sdk/commit/3cf43bdf1a111e119df4ebc2a0706f80f8c674e2))


### Build System

* **deps-dev:** bump @babel/preset-env from 7.16.0 to 7.23.9 ([#36](https://github.com/bucketeer-io/node-server-sdk/issues/36)) ([5137b28](https://github.com/bucketeer-io/node-server-sdk/commit/5137b28d0a2ed0d4a35d0f93b0f0f13f2da898b7))
* **deps-dev:** bump @bazel/rollup from 4.4.5 to 5.8.1 ([#32](https://github.com/bucketeer-io/node-server-sdk/issues/32)) ([2e62787](https://github.com/bucketeer-io/node-server-sdk/commit/2e62787734bc762b53dccc8e98c05b4ff79bbde2))
* **deps-dev:** bump @bazel/typescript from 4.4.5 to 5.8.1 ([#33](https://github.com/bucketeer-io/node-server-sdk/issues/33)) ([18f0bf4](https://github.com/bucketeer-io/node-server-sdk/commit/18f0bf4910486be8f010185c0d67dcb9f295c8c1))
* **deps-dev:** bump @rollup/plugin-replace from 3.0.0 to 5.0.5 ([#34](https://github.com/bucketeer-io/node-server-sdk/issues/34)) ([026f814](https://github.com/bucketeer-io/node-server-sdk/commit/026f81484f116135905adec9ffe99af80ccfc77c))
* **deps-dev:** bump typescript from 3.9.10 to 5.3.3 ([#38](https://github.com/bucketeer-io/node-server-sdk/issues/38)) ([f717c5c](https://github.com/bucketeer-io/node-server-sdk/commit/f717c5c06c65c0096c0259f34db21248bb6bfbc1))
* **deps:** bump actions/cache from 3 to 4 ([#28](https://github.com/bucketeer-io/node-server-sdk/issues/28)) ([ec2d4e9](https://github.com/bucketeer-io/node-server-sdk/commit/ec2d4e95cdf6be5daa7f541dcb764e5bc84500f3))
* **deps:** bump actions/checkout from 3 to 4 ([#29](https://github.com/bucketeer-io/node-server-sdk/issues/29)) ([c3478fc](https://github.com/bucketeer-io/node-server-sdk/commit/c3478fcdff4e9486215b9c320e5fb8607d9d73f2))
* **deps:** bump actions/setup-node from 3 to 4 ([#30](https://github.com/bucketeer-io/node-server-sdk/issues/30)) ([430a5d5](https://github.com/bucketeer-io/node-server-sdk/commit/430a5d54f6fc55e765648a638d04cca021b9afd7))
* **deps:** bump amannn/action-semantic-pull-request ([#26](https://github.com/bucketeer-io/node-server-sdk/issues/26)) ([86ca6b6](https://github.com/bucketeer-io/node-server-sdk/commit/86ca6b6be7c604429e7ce3fc08bb2e03afc0b6e6))
* **deps:** bump amannn/action-semantic-pull-request ([#54](https://github.com/bucketeer-io/node-server-sdk/issues/54)) ([48edc2b](https://github.com/bucketeer-io/node-server-sdk/commit/48edc2b9b4f2023f8dadff8d0b86a3a2234a9f86))
* **deps:** bump google-github-actions/release-please-action ([#31](https://github.com/bucketeer-io/node-server-sdk/issues/31)) ([c4ea281](https://github.com/bucketeer-io/node-server-sdk/commit/c4ea28108235b0237e7e877c11a6c9501f291930))
* **deps:** bump the dependencies group with 10 updates ([#49](https://github.com/bucketeer-io/node-server-sdk/issues/49)) ([58c25c5](https://github.com/bucketeer-io/node-server-sdk/commit/58c25c522284a2ac3a7c87da8c304812d15ba007))
* **deps:** bump the dependencies group with 10 updates ([#51](https://github.com/bucketeer-io/node-server-sdk/issues/51)) ([6f717f7](https://github.com/bucketeer-io/node-server-sdk/commit/6f717f74623bf3ede601ebde51878355626532f6))
* **deps:** bump the dependencies group with 10 updates ([#55](https://github.com/bucketeer-io/node-server-sdk/issues/55)) ([e4067b1](https://github.com/bucketeer-io/node-server-sdk/commit/e4067b16bc59e322e14531937c31f68aae56edb6))
* **deps:** bump the dependencies group with 12 updates ([#64](https://github.com/bucketeer-io/node-server-sdk/issues/64)) ([ee4b094](https://github.com/bucketeer-io/node-server-sdk/commit/ee4b094f545774255fb83bea48cf503ffbe08c94))
* **deps:** bump the dependencies group with 16 updates ([#69](https://github.com/bucketeer-io/node-server-sdk/issues/69)) ([b3de67d](https://github.com/bucketeer-io/node-server-sdk/commit/b3de67d55c8cad22ef74b15d71d612d532cc1bd0))
* **deps:** bump the dependencies group with 17 updates ([#68](https://github.com/bucketeer-io/node-server-sdk/issues/68)) ([5f2c148](https://github.com/bucketeer-io/node-server-sdk/commit/5f2c1487117b3acf34b1b36b60efa2b28d15283b))
* **deps:** bump the dependencies group with 2 updates ([#50](https://github.com/bucketeer-io/node-server-sdk/issues/50)) ([b022b5c](https://github.com/bucketeer-io/node-server-sdk/commit/b022b5c791296e14be3f68eecaf0f86d9e276bb4))
* **deps:** bump the dependencies group with 2 updates ([#67](https://github.com/bucketeer-io/node-server-sdk/issues/67)) ([8f60700](https://github.com/bucketeer-io/node-server-sdk/commit/8f60700d4c921cf303b9772f7a28cfd30bc90f1f))
* **deps:** bump the dependencies group with 20 updates ([#41](https://github.com/bucketeer-io/node-server-sdk/issues/41)) ([21eb26c](https://github.com/bucketeer-io/node-server-sdk/commit/21eb26c0ea748dbb385aac5c4eda21d9d39418af))
* **deps:** bump the dependencies group with 5 updates ([#53](https://github.com/bucketeer-io/node-server-sdk/issues/53)) ([8a3a0c2](https://github.com/bucketeer-io/node-server-sdk/commit/8a3a0c2382afac02740a47df0d54c35a9bdc2c48))
* **deps:** update eslint ([#66](https://github.com/bucketeer-io/node-server-sdk/issues/66)) ([22cac48](https://github.com/bucketeer-io/node-server-sdk/commit/22cac48b857906c355927b40b6fc4f9ad9740335))

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
