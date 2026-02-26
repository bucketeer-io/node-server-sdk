# gRPC → REST Migration Analytics & Plan

## 1. Context

The previous phase (documented in `evaluation_model_analytics.md`) focused on the model/converter layer.  
This document covers the **transport layer migration**: replacing `GRPCClient` with `APIClient` inside the two cache processors and updating every related mock and test.

The two processors affected are:

| Processor | File |
|---|---|
| `DefaultFeatureFlagProcessor` | `src/cache/processor/featureFlagCacheProcessor.ts` |
| `DefaultSegementUserCacheProcessor` | `src/cache/processor/segmentUsersCacheProcessor.ts` |

---

## 2. Current gRPC Client Contract vs. REST Client Contract

### 2.1 `GRPCClient` (to be removed from processors)

```
interface GRPCClient {
  getFeatureFlags(options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    sourceId: SourceId;
    sdkVersion: string;
  }): Promise<GetFeatureFlagsResponse>  // ← @bucketeer/evaluation protobuf type

  getSegmentUsers(options: {
    segmentIdsList: string[];
    requestedAt: number;
    sourceId: SourceId;
    sdkVersion: string;
  }): Promise<GetSegmentUsersResponse>  // ← @bucketeer/evaluation protobuf type
}
```

Key characteristics of the gRPC response:
- Returns **protobuf objects** (`GetFeatureFlagsResponse`, `GetSegmentUsersResponse` from `@bucketeer/evaluation`).
- Exposes **getter methods**: `.getForceUpdate()`, `.getFeatureFlagsId()`, `.getFeaturesList()`, `.getArchivedFeatureFlagIdsList()`, `.getRequestedAt()`, `.getSegmentUsersList()`, `.getDeletedSegmentIdsList()`, `.serializeBinary()`.
- Returns a **single value** (`Promise<T>`).

### 2.2 `APIClient` (REST — target)

```
class APIClient {
  getFeatureFlags(
    tag, featureFlagsId, requestedAt, sourceId, sdkVersion
  ): Promise<[GetFeatureFlagsResponse, number]>   // ← plain TS type + byte size

  getSegmentUsers(
    segmentIds, requestedAt, sourceId, sdkVersion
  ): Promise<[GetSegmentUsersResponse, number]>   // ← plain TS type + byte size
}
```

Key characteristics of the REST response:
- Returns **plain TypeScript objects** (from `src/objects/response.ts`), **not** protobuf instances.
- Returns a **tuple** `[response, byteSize]` — the second element replaces `serializeBinary().length`.
- Exposes **plain properties** (not getter methods): `.forceUpdate`, `.featureFlagsId`, `.features`, `.archivedFeatureFlagIds`, `.requestedAt`, `.segmentUsers`, `.deletedSegmentIds`.
- The `segmentIds` parameter is named `segmentIds` (not `segmentIdsList`).
- Signature uses **positional args** instead of an options object.

---

## 3. Impact Analysis

### 3.1 `featureFlagCacheProcessor.ts`

#### A. Options type (`FeatureFlagProcessorOptions`)
| Field | Impact |
|---|---|
| `grpc: GRPCClient` | **Replace** with `apiClient: APIClient` |

#### B. Class fields & constructor
| Change | Notes |
|---|---|
| `private grpc: GRPCClient` → `private apiClient: APIClient` | Rename field, update constructor assignment |

#### C. `getFeatureFlags()` private method — call site differences

| Aspect | gRPC | REST |
|---|---|---|
| Call style | `this.grpc.getFeatureFlags({ tag, featureFlagsId, requestedAt, sourceId, sdkVersion })` | `this.apiClient.getFeatureFlags(tag, featureFlagsId, requestedAt, sourceId, sdkVersion)` |
| Return type | `Promise<GetFeatureFlagsResponse (protobuf)>` | `Promise<[GetFeatureFlagsResponse (plain), number]>` |
| Size measurement | `featureFlags.serializeBinary().length` | Destructured `size` from tuple |
| Data access | `.getForceUpdate()` `.getFeatureFlagsId()` `.getFeaturesList()` `.getArchivedFeatureFlagIdsList()` `.getRequestedAt()` | `.forceUpdate` `.featureFlagsId` `.features` `.archivedFeatureFlagIds` `.requestedAt` |

#### D. `deleteAllAndSaveLocalCache` / `updateLocalCache` signatures
- Parameter type changes from `Feature[]` (protobuf `@bucketeer/evaluation`) to `Feature[]` (from `src/objects/feature.ts`).
- The items stored in `featureFlagCache.put(feature)` must be converter-compatible protobuf features, so **a converter call is required** between reading the response and writing to the cache (as planned in `evaluation_model_analytics.md`).

> [!IMPORTANT]
> The REST response returns **plain objects** (`src/objects/feature.ts`), but `FeaturesCache.put()` expects a **protobuf `Feature`**. The converter from `evaluation_model_analytics.md` bridges this gap and must be called inside `getFeatureFlags()` before any cache writes.

---

### 3.2 `segmentUsersCacheProcessor.ts`

#### A. Options type (`SegementUsersCacheProcessorOptions`)
| Field | Impact |
|---|---|
| `grpc: GRPCClient` | **Replace** with `apiClient: APIClient` |

#### B. Class fields & constructor
Same rename pattern as the feature flag processor.

#### C. `getSegmentUsers()` private method — call site differences

| Aspect | gRPC | REST |
|---|---|---|
| Param name | `segmentIdsList` | `segmentIds` |
| Call style | `this.grpc.getSegmentUsers({ segmentIdsList, requestedAt, sourceId, sdkVersion })` | `this.apiClient.getSegmentUsers(segmentIds, requestedAt, sourceId, sdkVersion)` |
| Return type | `Promise<GetSegmentUsersResponse (protobuf)>` | `Promise<[GetSegmentUsersResponse (plain), number]>` |
| Size measurement | `resp.serializeBinary().length` | Destructured `size` from tuple |
| Data access | `.getForceUpdate()` `.getRequestedAt()` `.getSegmentUsersList()` `.getDeletedSegmentIdsList()` | `.forceUpdate` `.requestedAt` `.segmentUsers` `.deletedSegmentIds` |

#### D. `updateLocalCache` / `deleteAllAndSaveLocalCache`
- `segmentUsersList` type changes from `SegmentUsers[] (protobuf)` to `SegmentUsers[] (plain, src/objects/segment.ts)`.
- Same converter intermediary requirement applies.

---

### 3.3 Mock Impact (`src/__tests__/mocks/gprc.ts` → new `mocks/api.ts`)

The current `MockGRPCClient` implements `GRPCClient` and is referenced in **12 test files** across:

```
src/__tests__/cache/processor/featureCache/init.ts
src/__tests__/cache/processor/featureCache/polling.ts
src/__tests__/cache/processor/featureCache/update.ts
src/__tests__/cache/processor/segementUsersCache/init.ts
src/__tests__/cache/processor/segementUsersCache/polling.ts
src/__tests__/cache/processor/segementUsersCache/update.ts
```

A new `MockAPIClient` must be created that:
- Implements the `APIClient` interface (or an extracted `IAPIClient` interface).
- Returns `Promise<[T, number]>` tuples.

---

### 3.4 Test Impact — Processor Tests

All processor tests that currently use `MockGRPCClient` must be updated. The table below summarises the per-file changes.

#### Feature Flag Processor Tests

| Test File | Changes Required |
|---|---|
| `featureCache/init.ts` | Import `MockAPIClient`; update `options.grpc` → `options.apiClient`; replace `new GetFeatureFlagsResponse()` + protobuf setters with plain object literals; change `mockGRPCClient` → `mockAPIClient`; change response return value to tuple; replace `.serializeBinary().length` with the tuple size |
| `featureCache/update.ts` | Same 6-point change set as `init.ts` — applies to all 8 test cases in this file |
| `featureCache/polling.ts` | Same pattern — verify polling schedule interaction with the new client mock |

#### Segment Users Processor Tests

| Test File | Changes Required |
|---|---|
| `segementUsersCache/init.ts` | Import `MockAPIClient`; rename `segmentIdsList` → `segmentIds`; replace protobuf `GetSegmentUsersResponse` / `SegmentUsers` / `SegmentUser` construction with plain objects; switch to tuple return |
| `segementUsersCache/update.ts` | Same 5-point change set |
| `segementUsersCache/polling.ts` | Same pattern |

#### Concrete diff per test — what changes inside each test case

```diff
// BEFORE (gRPC)
- const response = new GetFeatureFlagsResponse();
- response.setFeatureFlagsId('feature-flags-id-2');
- response.setRequestedAt(20);
- response.setForceUpdate(true);
- response.setFeaturesList([feature]);
- response.setArchivedFeatureFlagIdsList([]);
- const responseSize = response.serializeBinary().length;
- mockGRPCClient.expects('getFeatureFlags').returns(response);

// AFTER (REST)
+ const response: GetFeatureFlagsResponse = {
+   featureFlagsId: 'feature-flags-id-2',
+   requestedAt: '20',
+   forceUpdate: true,
+   features: [feature],
+   archivedFeatureFlagIds: [],
+ };
+ const responseSize = 512; // or any representative number
+ mockAPIClient.expects('getFeatureFlags').returns([response, responseSize]);
```

> [!NOTE]
> `requestedAt` in the plain REST type is typed as `string` (ISO timestamp or numeric string), whereas the gRPC version is `number`. The processor will need to parse it (e.g. `Number(response.requestedAt)`) before storing in cache.

---

### 3.5 `pushSizeMetricsEvent` — Sizing Strategy

gRPC used `serializeBinary().length` to compute byte size. With REST this is no longer available from the response object itself. The `APIClient` already returns the byte size as the second tuple element (read from the `content-length` HTTP header). This value should be used directly — no behavioral change in metrics, just a different source.

---

## 4. Scope Summary

| Category | Items Affected | Effort |
|---|---|---|
| Processor source files | 2 (`featureFlagCacheProcessor.ts`, `segmentUsersCacheProcessor.ts`) | Low |
| Mock files | 1 new (`mocks/api.ts`) | Low |
| Processor test files | 6 files (init, update, polling × 2 processors) | Medium |
| Converter integration | Converter must be called in each processor's fetch method | Low (hook-in only) |
| Response type | Switch from protobuf getters to plain property access | Low |

**Total files to modify: ~9** (2 source, 1 new mock, 6 test files).  
**No changes to cache layer, evaluator, or event emitter logic.**

---

## 5. Step-by-Step Migration Plan

### Step 1 — Create `MockAPIClient`

**File:** `src/__tests__/mocks/api.ts` *(new file)*  
**Action:** Create a `MockAPIClient` class that implements the same two methods `getFeatureFlags` and `getSegmentUsers` but returns the REST tuple signatures `Promise<[T, number]>`.  
**Why first:** All test changes depend on this mock existing.

---

### Step 2 — Migrate `featureFlagCacheProcessor.ts`

**File:** `src/cache/processor/featureFlagCacheProcessor.ts`  
**Actions:**
1. Replace `import { GRPCClient }` with `import { APIClient }` from `../../api/client`.
2. Remove `import { Feature } from '@bucketeer/evaluation'`; instead import `Feature` from `../../objects/feature`.
3. Rename `grpc` → `apiClient` in the options type, class field, and constructor.
4. In `getFeatureFlags()`: destructure tuple `const [featureFlags, size] = await this.apiClient.getFeatureFlags(...)`.
5. Replace all protobuf getter calls with plain property access.
6. Use `size` directly for `pushSizeMetricsEvent` instead of `serializeBinary().length`.
7. Convert `featureFlags.requestedAt` from `string` to `number` before storing in cache.
8. Wire converter call: before passing `featureFlags.features` to cache methods, convert each `Feature` (plain) → proto `Feature` via the converter from the previous phase.

---

### Step 3 — Migrate `segmentUsersCacheProcessor.ts`

**File:** `src/cache/processor/segmentUsersCacheProcessor.ts`  
**Actions:**
1. Replace `import { GRPCClient }` with `import { APIClient }`.
2. Remove `import { SegmentUsers } from '@bucketeer/evaluation'`.
3. Rename `grpc` → `apiClient` in options, field, and constructor.
4. In `getSegmentUsers()`: destructure tuple; rename `segmentIdsList` → `segmentIds`.
5. Replace protobuf getter calls with plain property access (`.segmentUsers`, `.deletedSegmentIds`, `.forceUpdate`, `.requestedAt`).
6. Use tuple size for `pushSizeMetricsEvent`.
7. Parse `requestedAt` string → number.
8. Wire converter for `SegmentUsers` plain → proto conversion before cache writes.

---

### Step 4 — Update Feature Flag Processor Tests

**Files:** `featureCache/init.ts`, `featureCache/update.ts`, `featureCache/polling.ts`  
**Actions per file:**
1. Replace `import { MockGRPCClient }` with `import { MockAPIClient }`.
2. Replace `GetFeatureFlagsResponse` protobuf construction with plain object literals.
3. Update `options.grpc` → `options.apiClient`.
4. Update `mockGRPCClient` → `mockAPIClient`.
5. Update mock return values from `response` → `[response, responseSize]`.
6. Replace `response.serializeBinary().length` with the numeric size value from the tuple.

---

### Step 5 — Update Segment Users Processor Tests

**Files:** `segementUsersCache/init.ts`, `segementUsersCache/update.ts`, `segementUsersCache/polling.ts`  
**Actions per file:**
1. Replace `import { MockGRPCClient }` with `import { MockAPIClient }`.
2. Replace `GetSegmentUsersResponse`, `SegmentUsers`, `SegmentUser` protobuf construction with plain object literals.
3. Update `options.grpc` → `options.apiClient`.
4. Rename `segmentIdsList` → `segmentIds` in mock `withArgs` assertions.
5. Update mock return values to tuples.

---

### Step 6 — Verify All Tests Pass

Run the full test suite to confirm zero regressions:

```bash
cd node-server-sdk && npm test
```

Confirm these test suites specifically pass:
- `src/__tests__/cache/processor/featureCache/`
- `src/__tests__/cache/processor/segementUsersCache/`

---

## 6. Key Design Decisions

| Decision | Rationale |
|---|---|
| Keep `GRPCClient` / `grpc/client.ts` intact | It may still be referenced elsewhere; removing it is a separate cleanup task |
| `apiClient` field name (not `api`) | Matches naming in `src/api/client.ts` and is more descriptive |
| No new interface for `APIClient` | `APIClient` is a class, not an interface; mock can just instantiate and stub methods via sinon |
| `requestedAt` string→number conversion inside processor | Keeps the REST response type faithful to the wire format without polluting `objects/response.ts` |
| Converter is called inside processors, not inside `APIClient` | Keeps `APIClient` transport-only; conversion is a processor responsibility |

---

## 7. Out of Scope

- Removing `grpc/client.ts` or `GRPCClient` interface (separate cleanup).
- Changes to `FeaturesCache`, `SegmentUsersCache`, or `InMemoryCache` layers.
- Changes to `APIClient` itself — it is already complete and ready.
- Changes to evaluation / local evaluator logic.
