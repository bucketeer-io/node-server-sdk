#############################
# Variables
#############################
PROTO_TOP_DIR := $(shell cd ../bucketeer && pwd)
PROTOBUF_INCLUDE_DIR := ${PROTO_TOP_DIR}/proto/external/protocolbuffers/protobuf/v3.9.0
PROTO_FOLDERS := event/client feature gateway user
PROTO_OUTPUT := proto_output
IMPORT_PATH_FROM := github.com/ca-dp/bucketeer
IMPORT_PATH_TO := github.com/ca-dp/bucketeer-node-server-sdk

PROTO_SRC=../bucketeer/proto
PROTO_DEST=./src

# set output directory to CI cache path via environment variables
BZFLAGS =
BUILD_FLAGS =
ifdef IS_CI
	BAZEL_OUTPUT_BASE ?= ../bazel-cache
	BZLFLAGS += --output_base ${BAZEL_OUTPUT_BASE}
	BUILD_FLAGS += --action_env=DOCKER_HOST --remote_http_cache=${BAZEL_REMOTE_CACHE} --google_credentials=${BAZEL_REMOTE_CACHE_CREDENTIALS}
endif

NPM_BIN_DIR := $(CURDIR)/node_modules/.bin
GENFILES_DIR := $(CURDIR)/__lib

GIT_REVISION := $(shell git rev-parse --verify HEAD)

export PACKAGE_NAME := $(shell node -p "require('./package.json').name")
export CURRENT_VERSION := $(shell npm view $(PACKAGE_NAME) version 2>/dev/null || echo 0.0.0)
export LOCAL_VERSION := $(shell node -p "require('./package.json').version")

.PHONY: init
init:
	yarn

.PHONY: clean
clean:
	rm -rf $(CURDIR)/__test $(CURDIR)/__e2e $(CURDIR)/lib

.PHONY: build
build: clean-build tsc copy-proto-dts rename-js

.PHONY: clean-build
clean-build:
	rm -rf $(GENFILES_DIR)

.PHONY: tsc
tsc:
	$(NPM_BIN_DIR)/tsc --project tsconfig.json

.PHONY: copy-proto-dts
copy-proto-dts:
	$(NPM_BIN_DIR)/cpx '$(CURDIR)/src/**/*.d.ts' $(GENFILES_DIR)

.PHONY: rename-js
rename-js:
	$(NPM_BIN_DIR)/rename '$(GENFILES_DIR)/**/*.js' '{{f}}.mjs'

.PHONY: test
test:
	rm -rf $(CURDIR)/__test
	$(NPM_BIN_DIR)/babel src --extensions '.ts' --config-file "$(CURDIR)/babel-test.config.js" --out-dir "__test"
	cp -r $(CURDIR)/src/__tests__/testdata __test/__tests__/
	$(NPM_BIN_DIR)/ava --config ava-test.config.js

.PHONY: e2e
e2e: copy-genfiles
	rm -rf $(CURDIR)/__e2e
	$(NPM_BIN_DIR)/babel e2e --extensions '.ts' --config-file "$(CURDIR)/babel-e2e.config.js" --out-dir "__e2e/__test__"
	$(NPM_BIN_DIR)/babel lib --extensions '.mjs' --config-file "$(CURDIR)/babel-e2e.config.js" --out-dir "__e2e/lib"
	$(NPM_BIN_DIR)/ava --config ava-e2e.config.js

.PHONY: fmt
fmt: tsfmt

.PHONY: tsfmt
tsfmt:
	$(NPM_BIN_DIR)/prettier --write '$(CURDIR)/src/**/*.ts'

.PHONY: lint
lint:
	$(NPM_BIN_DIR)/eslint '$(CURDIR)/src/**/*.ts'

.PHONY: copy-genfiles
copy-genfiles:
	@rm -rf $(CURDIR)/lib
	$(NPM_BIN_DIR)/cpx '$(GENFILES_DIR)/**/*.{mjs,d.ts}' $(CURDIR)/lib
	$(NPM_BIN_DIR)/cpx '$(GENFILES_DIR)/bucketeer.*' $(CURDIR)/lib
	@find $(CURDIR)/lib -type f -exec chmod 644 {} +
	$(NPM_BIN_DIR)/rename '$(CURDIR)/lib/**/*.js' '{{f}}.mjs'
	$(NPM_BIN_DIR)/babel lib --extensions '.mjs' --config-file "$(CURDIR)/babel.config.js" --out-dir "lib"

.PHONY: publish-dry
publish-dry: copy-genfiles
	npm publish --dry-run

.PHONY: publish
publish: copy-genfiles
ifeq ($(shell $(NPM_BIN_DIR)/semver -r ">$(CURRENT_VERSION)" $(LOCAL_VERSION) ),$(LOCAL_VERSION))
	npm publish --access public
else
	@echo "$(LOCAL_VERSION) exists. skip publish."
endif

#############################
# Proto
#############################
.PHONY: clean-proto
clean-proto:
	rm -rf src/proto/**/*.{js,ts}


# We must manually remove lines related to google/api/annotations_pb.
# See: https://github.com/improbable-eng/ts-protoc-gen/issues/201#issuecomment-563295145
.PHONY: gen-proto
gen-proto: clean-proto
	for f in ${PROTO_FOLDERS}; do \
		$(NPM_BIN_DIR)/grpc_tools_node_protoc \
			--js_out=import_style=commonjs,binary:${PROTO_DEST} \
			--ts_out=grpc_js:$(PROTO_DEST) \
			--grpc_out=grpc_js:${PROTO_DEST} \
			--plugin=protoc-gen-grpc=$(NPM_BIN_DIR)/grpc_tools_node_protoc_plugin \
			--plugin=protoc-gen-ts=$(NPM_BIN_DIR)/protoc-gen-ts \
			-I ${PROTO_TOP_DIR} \
			-I"${GOPATH}/src/github.com/googleapis/googleapis" \
			${PROTO_TOP_DIR}/proto/$$f/*.proto; \
	done;
	find $(PROTO_DEST)/proto -type f -name '*.js' | xargs sed -i '' '/google_api_annotations_pb/d'
