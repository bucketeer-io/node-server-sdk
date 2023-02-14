#############################
# Variables
#############################
IMPORT_PATH_FROM := github.com/ca-dp/bucketeer
IMPORT_PATH_TO := github.com/ca-dp/bucketeer-node-server-sdk

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
build: clean-build tsc rename-js

.PHONY: clean-build
clean-build:
	rm -rf $(GENFILES_DIR)

.PHONY: tsc
tsc:
	$(NPM_BIN_DIR)/tsc --project tsconfig.json

.PHONY: rename-js
rename-js:
	$(NPM_BIN_DIR)/rename '$(GENFILES_DIR)/**/*.js' '{{f}}.mjs'

.PHONY: test
test:
	rm -rf $(CURDIR)/__test
	$(NPM_BIN_DIR)/babel src --extensions '.ts' --config-file "$(CURDIR)/babel-test.config.js" --out-dir "__test"
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
