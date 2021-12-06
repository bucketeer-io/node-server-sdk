workspace(
    name = "bucketeer_web_sdk",
    managed_directories = {
        "@npm": ["node_modules"],
    },
)

load(
    "@bazel_tools//tools/build_defs/repo:http.bzl",
    "http_archive",
)

###############################################################################
# NodeJS
###############################################################################
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "84abf7ac4234a70924628baa9a73a5a5cbad944c4358cf9abdb4aab29c9a5b77",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.7.0/rules_nodejs-1.7.0.tar.gz"],
)
# http_archive(
#     name = "build_bazel_rules_nodejs",
#     sha256 = "f7037c8e295fdc921f714962aee7c496110052511e2b14076bd8e2d46bc9819c",
#     urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.4.5/rules_nodejs-4.4.5.tar.gz"],
# )

load(
    "@build_bazel_rules_nodejs//:index.bzl",
    "node_repositories",
    "yarn_install",
)

# ref: https://nodejs.org/dist/v14.5.0/SHASUMS256.txt.asc
node_repositories(
    node_repositories = {
        "14.5.0-darwin_amd64": ("node-v14.5.0-darwin-x64.tar.gz", "node-v14.5.0-darwin-x64", "47dfd88abcd4d6d6f7b7516c95645f9760ba9c93d04b51a92895584c945b2953"),
        "14.5.0-linux_amd64": ("node-v14.5.0-linux-x64.tar.xz", "node-v14.5.0-linux-x64", "8b0235c318de87ecf8eec9a39e5c5df80757dbec571addda7123276dfcb34d5b"),
        "14.5.0-windows_amd64": ("node-v14.5.0-win-x64.zip", "node-v14.5.0-win-x64", "ab5728c85ece98210036fc9c38984fa2410a882dd99075b3d5bece58e4cc6ea2"),
    },
    node_urls = ["https://nodejs.org/dist/v{version}/{filename}"],
    node_version = "14.5.0",
    package_json = ["//:package.json"],
    yarn_repositories = {
        "1.19.1": ("yarn-v1.19.1.tar.gz", "yarn-v1.19.1", "34293da6266f2aae9690d59c2d764056053ff7eebc56b80b8df05010c3da9343"),
    },
    yarn_urls = ["https://github.com/yarnpkg/yarn/releases/download/v{version}/{filename}"],
    yarn_version = "1.19.1",
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()
