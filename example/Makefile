NPM_BIN_DIR := $(CURDIR)/node_modules/.bin
SDK_DIR := $(CURDIR)/..

.PHONY: init
init:
	yarn

.PHONY: start
start: build-sdk build
	node $(CURDIR)/__build/index.js

.PHONY: clean
clean:
	rm -rf $(CURDIR)/__build

.PHONY: build
build: clean
	$(MAKE) copy-genfiles -C $(SDK_DIR)
	$(NPM_BIN_DIR)/tsc --project $(CURDIR)/tsconfig.json

.PHONY: build-sdk
build-sdk:
	$(MAKE) build -C $(SDK_DIR)