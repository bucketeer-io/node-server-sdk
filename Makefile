# set output directory to CI cache path via environment variables
BZFLAGS =
BUILD_FLAGS =
ifdef IS_CI
	BAZEL_OUTPUT_BASE ?= ../bazel-cache
	BZLFLAGS += --output_base ${BAZEL_OUTPUT_BASE}
	BUILD_FLAGS += --action_env=DOCKER_HOST --remote_http_cache=${BAZEL_REMOTE_CACHE} --google_credentials=${BAZEL_REMOTE_CACHE_CREDENTIALS}
endif

NPM_BIN_DIR := $(CURDIR)/node_modules/.bin
GENFILES_DIR := $(CURDIR)/bazel-bin

# Sorry. These are depends on *nix way...
export GIT_REVISION := $(shell git rev-parse --verify HEAD)
export BUILD_DATE := $(shell date '+%Y/%m/%d %H:%M:%S %z')

export PACKAGE_NAME := $(shell node -p "require('./package.json').name")
export CURRENT_VERSION := $(shell npm view $(PACKAGE_NAME) version 2>/dev/null || echo 0.0.0)
export LOCAL_VERSION := $(shell node -p "require('./package.json').version")

.PHONY: init
init: ## Install dependencies
	yarn

.PHONY: clean
clean:
	rm -rf $(CURDIR)/__test $(CURDIR)/__e2e $(CURDIR)/lib

.PHONY: build
build:
	bazelisk ${BZLFLAGS} build ${BUILD_FLAGS} --workspace_status_command="echo GIT_REVISION ${GIT_REVISION}" //...

.PHONY: test
test:
	rm -rf $(CURDIR)/__test
	$(NPM_BIN_DIR)/babel src --extensions '.ts' --config-file "$(CURDIR)/babel-test.config.js" --out-dir "__test"
	$(NPM_BIN_DIR)/ava --config ava-test.config.js

.PHONY: e2e
e2e: copy_genfiles
	rm -rf $(CURDIR)/__e2e
	$(NPM_BIN_DIR)/babel e2e --extensions '.ts' --config-file "$(CURDIR)/babel-e2e.config.js" --out-dir "__e2e/__test__"
	$(NPM_BIN_DIR)/babel lib --extensions '.mjs' --config-file "$(CURDIR)/babel-e2e.config.js" --out-dir "__e2e/lib"
	$(NPM_BIN_DIR)/ava --config ava-e2e.config.js

.PHONY: fmt
fmt: tsfmt ## Run all formatters

.PHONY: tsfmt
tsfmt:
	$(NPM_BIN_DIR)/prettier --write '$(CURDIR)/src/**/*.ts'

.PHONY: lint
lint:
	$(NPM_BIN_DIR)/eslint '$(CURDIR)/src/**/*.ts'

.PHONY: copy_genfiles
copy_genfiles:
	@rm -rf $(CURDIR)/lib
	$(NPM_BIN_DIR)/cpx '$(GENFILES_DIR)/src/**/*.{mjs,d.ts}' $(CURDIR)/lib
	$(NPM_BIN_DIR)/cpx '$(GENFILES_DIR)/src/bucketeer.*' $(CURDIR)/lib
	@find $(CURDIR)/lib -type f -exec chmod 644 {} +
	$(NPM_BIN_DIR)/rename '$(CURDIR)/lib/**/*.js' '{{f}}.mjs'
	$(NPM_BIN_DIR)/replace 'process.env.GIT_REVISION' '"$(GIT_REVISION)"' $(CURDIR)/lib/shared.mjs
	$(NPM_BIN_DIR)/babel lib --extensions '.mjs' --config-file "$(CURDIR)/babel.config.js" --out-dir "lib"

.PHONY: publish_dry
publish_dry: copy_genfiles
	npm publish --dry-run

.PHONY: publish
publish: copy_genfiles
ifeq ($(shell $(NPM_BIN_DIR)/semver -r ">$(CURRENT_VERSION)" $(LOCAL_VERSION) ),$(LOCAL_VERSION))
	npm publish --unsafe-perm
else
	@echo "$(LOCAL_VERSION) exists. skip publish."
endif
