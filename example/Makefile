NPM_BIN_DIR := $(CURDIR)/node_modules/.bin
SDK_DIR := $(CURDIR)/..

.PHONY: init
init: ## Install dependencies.
	yarn

.PHONY: start
start:
	node $(CURDIR)/__build/index.js

.PHONY: clean
clean:
	rm -rf $(CURDIR)/__build

.PHONY: build
build: clean
	$(MAKE) copy_genfiles -C $(SDK_DIR)
	$(NPM_BIN_DIR)/tsc --project $(CURDIR)/tsconfig.json