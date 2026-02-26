# Evaluation Model Analytics & Planning

## 1. Overview
The goal is to convert the Node SDK models (from `src/objects/feature.ts` and `src/objects/segment.ts`) into the protobuf models defined in the `@bucketeer/evaluation` module so they can be consumed by the Local Evaluator (`src/evaluator/local.ts`) and subsequently the cache (`FeaturesCache` and `SegmentUsersCache`).

The logic for instantiating these protobuf models currently resides in `bucketeer/evaluation/typescript/src/modelFactory.ts`. However, to prevent any breaking changes and avoid delays associated with waiting for a new npm release of the `@bucketeer/evaluation` package, **all new converter logic will be implemented directly within `node-server-sdk`**.

## 2. Analysis of Current `modelFactory.ts`

Upon reviewing `modelFactory.ts`, it is evident that the current implementation is too simplified and was likely built for simple test cases or older structures. It does not fully support the rich data structures present in the Go and Node SDK models.

### A. Missing `RolloutStrategy` support in Features & Rules
- `createFeature`: The `defaultStrategy` argument currently only accepts a simple `{ type, variation }` structure. It hardcodes the conversion to a `FixedStrategy` and does not support `RolloutStrategy`.
- `createRule`: Accepts strictly a `fixedVariation: string` instead of a full `Strategy` object. It forces `Strategy.Type.FIXED` for all rules, making `RolloutStrategy` impossible.

### B. Missing Multi-Clause Support in Rules
- `createRule`: Currently only accepts parameters for a **single** clause (`attribute`, `operator`, `values`). The actual model allows a Rule to have an array of `Clauses`. The factory function ignores this and hardcodes `rule.setClausesList([createClause(...)])`. 

### C. Missing Factory for `SegmentUsers`
- There is a `createSegmentUser` function which creates an individual user mapping (`SegmentUser` proto), but there is **no factory function** for the outer `SegmentUsers` wrapper (the array of users mapped to a `segmentId` with an `updatedAt` field), which is what `GetSegmentUsersResponse` actually returns.

### D. Missing Model Fields in `Feature`
- `createFeature` neglects several important fields that exist on the protobuf `Feature` model. While some may not strictly affect local evaluation logic (e.g. `ttl`, `deleted`, `maintainer`, `archived`, `samplingSeed`, `lastUsedInfo`), it is unsafe not to map them if we're doing a 1:1 conversion for the local cache.

To successfully convert `GetFeatureFlagsResponse` and `GetSegmentUsersResponse` payloads into protobufs without altering the `@bucketeer/evaluation` npm package, we will build a dedicated, internal converter module within `node-server-sdk`.

### Structure

- **File**: `src/evaluator/converter.ts` (New File inside `node-server-sdk`)
- **Purpose**: House the translation functions that map `src/objects` definitions into `google-protobuf` instances derived from `@bucketeer/evaluation`.

### Summary of Changes

| Target | Status | Notes |
| :--- | :--- | :--- |
| `createUser` | **Keep as is** | No changes required. |
| `createTarget` | **Keep as is** | No changes required. |
| `createFixedStrategy`| **Keep as is** | No changes required. |
| `createRolloutStrategy`| **Keep as is** | No changes required. |
| `createStrategy` | **Keep as is** | No changes required. |
| `createClause` | **Keep as is** | No changes required. |
| `createSegmentUser` | **Keep as is** | No changes required. |
| `createPrerequisite` | **Keep as is** | No changes required. |
| `createVariation` | **Keep as is** | No changes required. |
| `createEvaluation` | **Keep as is** | No changes required. |
| `createReason` | **Keep as is** | No changes required. |
| `createFeature` | **Keep as is** | Do not modify to prevent breaking existing tests. |
| `createFeatureWithOptions` | **New** | New function to accept full complex mappings (e.g., `ttl`, `lastUsedInfo`). |
| `createRule` | **Keep as is** | Do not modify to prevent breaking existing tests. |
| `createRuleFromOptions`| **New** | New function to accept full `Strategy` and `Clause[]` for complete mapping without breaking `createRule`. |
| `createSegmentUsers` | **New** | New function to construct the outer `SegmentUsers` proto. |
| `createFeatureLastUsedInfo` | **New** | New function to instantiate the `FeatureLastUsedInfo` proto. |

### Safety & Minimum Impact Strategy
**CRITICAL:** `createFeature` and `createRule` are heavily used across multiple test files in both `@bucketeer/evaluation` and `node-server-sdk`. Changing their primary signatures will instantly break numerous tests. 

By housing these new `...WithOptions` functions cleanly inside a dedicated `node-server-sdk` converter utility file, we guarantee **zero impact** to the underlying `@bucketeer/evaluation` library code and entirely evade npm deployment lag.

### Create `createFeatureWithOptions` (New)
- **Implement inside `node-server-sdk`**
- This new function will gracefully accept the full complex Node SDK model arrays and instantiate the Protobuf `Feature`.
  - Add mapping for `ttl`, `deleted`, `maintainer`, `archived`, `samplingSeed`, and `lastUsedInfo`.
  - Intelligently parse `defaultStrategy` if provided as a full `Strategy` object.
  - Map the custom `Rule` proto array directly.

### Create `createRuleFromOptions` (New)
- **Implement inside `node-server-sdk`**
- This function will accept a full SDK `Strategy` object and a `Clause[]` array, properly constructing the complex `Rule` protobuf instance.

### Create `createSegmentUsers` (New)
- **Implement inside `node-server-sdk`**
- Create a new factory function: `createSegmentUsers(segmentId: string, users: SegmentUser[], updatedAt: number): SegmentUsers`.
- This function will instantiate a `SegmentUsers` protobuf, apply `.setSegmentId()`, `.setUsersList()`, and `.setUpdatedAt()`, and return it.

### Create `createFeatureLastUsedInfo` (New)
- **Implement inside `node-server-sdk`**
- Instantiate the `FeatureLastUsedInfo` protobuf dependency natively.

## 4. Testing Plan for Converter Logic (TDD Approach)
Since we are employing Test-Driven Development (TDD), we will first establish a comprehensive test suite in `node-server-sdk` before implementing the converter logic.

**Test File:** `src/__tests__/evaluator/converter.ts`

### Test Suite 1: `createFeatureWithOptions`
We will validate that complete Node SDK `Feature` objects successfully mount to the `@bucketeer/evaluation` Protobuf `Feature`.

1. **TestCase: Full Feature Object Conversion**
   - **Input:** A mocked Node SDK `Feature` object complete with a `defaultStrategy` containing a complex `fixedStrategy` and `rolloutStrategy` (weights), complex multi-clause `rules`, prerequisites, and deep objects like `FeatureLastUsedInfo`.
   - **Assertion:** The resulting protobuf `.toObject()` must equal the initial input properties identically.
2. **TestCase: Missing Optional Dependencies**
   - **Input:** A mocked Node SDK `Feature` with only the raw mandatory fields (`id`, `name`, `version`, `variationType`). No `rules`, empty `targets`, no `defaultStrategy`, no `lastUsedInfo`.
   - **Assertion:** Ensure no undefined panics occur and that Protobuf fallback lists (`[]`) are correctly initialized.
3. **TestCase: Complex Rule Parsing**
   - **Input:** A mocked `Feature` possessing multiple `rules`, where each `Rule` contains multiple `clauses` (`EQUALS`, `IN`, etc.), mapped to a custom `RolloutStrategy`.
   - **Assertion:** Deep comparison of `feature.getRulesList()` objects explicitly verifying the array size and properties of the Strategy + Clauses.

### Test Suite 2: `createSegmentUsers`
We will validate the instantiation of the wrapper mapping class parsing raw ID data arrays.

1. **TestCase: Full SegmentUsers Mapping**
   - **Input:** A `segmentId`, a `updatedAt` timestamp, and an array of Node SDK `SegmentUser` objects mapping users as `INCLUDED` and `EXCLUDED`.
   - **Assertion:** `segmentUsers.getSegmentId()` matches, `getUpdatedAt()` matches, and `getUsersList()` returns precisely the same mapped states array without data loss.
2. **TestCase: Empty Users List**
   - **Input:** A `segmentId` with an empty `users` array.
   - **Assertion:** Returns a valid protobuf with a `length === 0` users list.

By implementing these strict tests beforehand, we will confidently execute the zero-impact strategy mapped above.

## 4. Next Steps & Summary
Once these updates are made to `@bucketeer/evaluation`'s `modelFactory.ts`, the `node-server-sdk` will be able to iterate over `GetFeatureFlagsResponse.features` and `GetSegmentUsersResponse.segmentUsers`, pass the raw objects through the revised `modelFactory` functions, and safely persist the resulting Protobuf models into `FeaturesCache` and `SegmentUsersCache` for `LocalEvaluator` consumption. 

No changes to the actual target logic are required yet as instructed. This document serves as the target plan for the analytic phase.
