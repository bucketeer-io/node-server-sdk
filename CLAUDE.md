# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
make init          # Install dependencies (yarn)
make build         # Compile TypeScript to __lib/, rename .js to .mjs
make test          # Transpile with Babel to __test/, then run ava tests
make test-single src/__tests__/some_test.ts  # Run one test file
make lint          # Run eslint
make fmt           # Run prettier on src/**/*.ts
make type-check    # tsc --noEmit (src + test + e2e)
make e2e           # Run E2E tests (requires .env with API_ENDPOINT, API_KEY, etc.)
```

**E2E setup**: copy `.env.example` to `.env` and fill in `API_ENDPOINT`, `CLIENT_API_KEY`, `SERVER_API_KEY`. `SCHEME` defaults to `https`.

## Architecture

### Build pipeline

TypeScript compiles to `__lib/` (`.js` to `.mjs`). `make copy-genfiles` copies to `lib/`, which is the published package output (main entry: `lib/index.js`). Tests bypass tsc and use Babel for speed (`__test/` directory).

### Public API (`src/index.ts`)

- `initializeBKTClient(config: BKTConfig): Bucketeer` - primary factory
- `initialize(config: Config): Bucketeer` - deprecated alias
- `Bucketeer` interface - `*Variation`, `*VariationDetails`, `track`, `destroy`, `waitForInitialization`
- `defineBKTConfig(partial)` - validates and fills defaults for `BKTConfig`

### Client (`src/client.ts`, `BKTClientImpl`)

The main SDK class. Owns:
- A scheduled flush loop (`createSchedule`) that drains `EventStore` every `eventsFlushInterval` (default 30 s)
- An immediate flush when the queue hits `eventsMaxQueueSize` (default 50)
- `destroy()` - stops the schedule, awaits `flushAllEvents()`, stops processors, closes the emitter
- `waitForInitialization()` - only meaningful when `enableLocalEvaluation: true`

### Two evaluation modes

**Remote** (default): each `*Variation` call hits `POST /get_evaluation` with a 30 s timeout. Events are queued and sent separately.

**Local** (`enableLocalEvaluation: true`): feature flags and segment users are cached in `InMemoryCache` and refreshed on `cachePollingInterval` (min/default 60 s). `LocalEvaluator` (`src/evaluator/local.ts`) uses the `@bucketeer/evaluation` package (protobuf-based) to evaluate locally. Requires a **server-side role API key**.

### Cache layer (`src/cache/`)

- `InMemoryCache` - generic `Map`-backed cache with TTL
- `FeaturesCache` / `SegmentUsersCache` - typed wrappers with namespace-prefixed keys
- `FeatureFlagProcessor` / `SegementUsersCacheProcessor` - poll the API and update the cache on a schedule; managed via `PollController` (abort-signal-based cancellation)

### API client (`src/api/client.ts`)

Uses Node's built-in `https` module (not fetch). Each method (`getEvaluation`, `getFeatureFlags`, `getSegmentUsers`, `registerEvents`) wraps `postRequestWithRetry`, which delegates to `promiseRetriable`.

### Retry logic (`src/utils/promiseRetriable.ts`)

Configurable via `BKTConfig.maxRetries` (default 3), `retryInitialInterval`, `retryMaxInterval`, `retryMultiplier`. Retries on network errors (`ECONNRESET`, `ETIMEDOUT`, etc.) and HTTP 429, 499, 500, 502, 503, 504. Exponential backoff with +-25% jitter. Respects `Retry-After` response header. `AbortSignal` cancels both the request and inter-retry sleep.

### Event deadline (`computeRegisterEventsDeadline` in `src/client.ts`)

Register-events timeout = `min(flushInterval * 0.8, 10 s)`, floored at 5 s. Mirrors Go SDK logic.

### Internal event bus (`src/processorEventsEmitter.ts`)

Typed `EventEmitter` with events: `pushEvaluationEvent`, `pushDefaultEvaluationEvent`, `pushLatencyMetricsEvent`, `pushSizeMetricsEvent`, `error`. The client subscribes to these to build and enqueue the correct event objects.

## Code comment style

Do not use emoji, `───`, `---`, or `--` (as em dashes) in code comments. Use plain ASCII text only.

## Development workflow

All code changes follow TDD: write a failing test first, then implement, then refactor. Exception: skip TDD only when the user explicitly requests it for the current task.

## Testing conventions

- Test files live in `src/__tests__/` and use **snake_case** names (e.g., `api_retry.ts`).
- Use `ava` as the test runner; mock HTTP with `msw` or sinon stubs.
- `make test-single` accepts the `src/` path; the Makefile translates it to the `__test/` path automatically.
