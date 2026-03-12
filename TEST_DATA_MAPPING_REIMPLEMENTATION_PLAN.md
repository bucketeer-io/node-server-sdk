# Re-implement Test Helpers

The goal is to cleanly swap out the `@bucketeer/evaluation` imports for `createFeature`, `createUser`, `createSegmentUser`, and `createPrerequisite` with local equivalents in the test suite. We will write these helpers in `src/__tests__/utils/index.ts` so they can be easily imported across all tests, without requiring updates to the existing test code logic itself.

## Proposed Changes

### Tests Utilities
#### [NEW] src/__tests__/utils/index.ts
Create a new file to house the helper functions: `createFeature`, `createUser`, `createSegmentUser`, and `createPrerequisite`. We are replacing the old `@bucketeer/evaluation` helpers because we want to simulate how the data mapping works in the exact same way we do in the network layer and evaluator locally. 
Therefore, these functions will map our local types (`Feature`, etc) directly into Protobuf-backed objects using the production code in `src/evaluator/converter.ts` (`toProtoFeature`, `toProtoUser`, `toProtoSegmentUsers` taking a `SegmentUser[]` wrapping object `SegmentUsers`, and `toProtoPrerequisite`). 
They will accept a parameter like `Partial<Feature>`, provide default fallbacks for missing values (e.g `id: ''`, `version: 0`, `variations: []`), and return the corresponding Proto object instantiated via `converter.ts`. 

**CRITICAL REQUIREMENT:** The interface of these 4 helpers must remain EXACTLY identical to their original `@bucketeer/evaluation` counterparts. Absolutely NO TEST CODE SHOULD CHANGE EXCEPT THE IMPORT PATH. We will expose these functions so they can be used as 100% transparent drop-in replacements.

### Tests using the helpers
Update imports in the test files to point to `../utils` instead of `@bucketeer/evaluation` for the 4 helper functions.
We will search and replace the imports in files such as:
- `src/__tests__/client_local_evaluation.ts`
- `src/__tests__/cache/feature_cache.ts`
- `src/__tests__/cache/segements_user.ts`
- `src/__tests__/evaluator/evaluator.ts`
- etc.

## Verification Plan

### Automated Tests
1. Run the entire test suite `make test` to ensure that swapping the helpers does not break any existing test logic.
2. The tests should continue passing without any modification to the test logic itself, only the imports should change.
