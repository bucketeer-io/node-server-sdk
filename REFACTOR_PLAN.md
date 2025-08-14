# Configuration Refactor Plan: Node.js Server SDK to Match Client-Side JavaScript SDK

## Executive Summary

This document outlines the refactor plan to align the Node.js Server-Side SDK configuration with the Client-Side JavaScript SDK naming conventions while maintaining backward compatibility to avoid breaking changes for existing applications.

## Current State Analysis

### Node.js Server-Side SDK (Current Implementation)

**Configuration Structure:**
```typescript
interface Config {
  host: string;                            // API endpoint
  token: string;                          // Authentication token
  tag: string;                            // Feature flag tag
  pollingIntervalForRegisterEvents?: number;  // Event polling interval
  logger?: Logger;                        // Logger instance
  enableLocalEvaluation?: boolean;        // Local evaluation flag
  cachePollingInterval?: number;          // Cache polling interval
}
```

**Initialization Pattern:**
```typescript
import { initialize } from '@bucketeer/node-server-sdk';

const config = {
  host: 'YOUR_API_ENDPOINT',
  token: 'YOUR_API_KEY',
  tag: 'YOUR_FEATURE_TAG',
  enableLocalEvaluation: true,
  cachePollingInterval: 10 * 60000,
};

const client = initialize(config);
```

### Client-Side JavaScript SDK (Target Pattern)

**Configuration Structure:**
```typescript
interface BKTConfig {
  apiKey: string;                         // Authentication key
  apiEndpoint: string;                    // API endpoint
  featureTag: string;                     // Feature flag tag
  appVersion: string;                     // Application version
  pollingInterval?: number;               // Polling interval (min 60s, default 10min)
  eventsFlushInterval?: number;           // Events flush interval (default 30s)
  eventsMaxQueueSize?: number;            // Event queue size (default 50)
  storageKeyPrefix?: string;              // Storage key prefix
  userAgent?: string;                     // User agent
  fetch?: Function;                       // Fetch function
}
```

**Initialization Pattern:**
```typescript
import { defineBKTConfig, initializeBKTClient, getBKTClient } from '@bucketeer/js-client-sdk';

const config = defineBKTConfig({
  apiKey: 'YOUR_API_KEY',
  apiEndpoint: 'YOUR_API_URL',
  featureTag: 'YOUR_FEATURE_TAG',
  appVersion: 'YOUR_APP_VERSION',
});

await initializeBKTClient(config, user);
const client = getBKTClient();
```

## Key Differences Identified

### 1. Configuration Property Names
| Current (Server SDK) | Target (Client SDK) | Purpose |
|---------------------|---------------------|---------|
| `host` | `apiEndpoint` | API endpoint URL |
| `token` | `apiKey` | Authentication credential |
| `tag` | `featureTag` | Feature flag tag |
| `cachePollingInterval` | `pollingInterval` | Data polling interval |
| `pollingIntervalForRegisterEvents` | `eventsFlushInterval` | Event submission interval |
| N/A | `appVersion` | Application version |
| N/A | `eventsMaxQueueSize` | Event queue size limit |
| N/A | `storageKeyPrefix` | Storage key prefix |
| N/A | `userAgent` | User agent string |
| N/A | `fetch` | Fetch function |

### 2. Function Names
| Current (Server SDK) | Target (Client SDK) | Purpose |
|---------------------|---------------------|---------|
| `initialize` | `initializeBKTClient` | Initialize client |
| N/A | `defineBKTConfig` | Define configuration |
| N/A | `getBKTClient` | Get client instance |

### 3. Type Names
| Current (Server SDK) | Target (Client SDK) | Purpose |
|---------------------|---------------------|---------|
| `Config` | `BKTConfig` | Configuration interface |

## Refactor Plan

### Phase 1: Add New Configuration Interface (Non-Breaking)

1. **Create Extended Configuration Interface**
   - Add new `BKTConfig` interface with client SDK naming
   - Keep existing `Config` interface for backward compatibility
   - Create mapping between old and new property names

2. **Add New Helper Functions**
   - Add `defineBKTConfig()` function
   - Add `initializeBKTClient()` function 
   - Add `getBKTClient()` function
   - Keep existing `initialize()` function

3. **Internal Implementation Updates**
   - Create property mappers to handle both old and new config formats
   - Update internal logic to work with both configuration styles
   - Ensure all new functions delegate to existing implementations

### Phase 2: Documentation and Migration Guide

1. **Update Documentation**
   - Add examples using new configuration format
   - Provide migration guide from old to new format
   - Document both approaches as supported

2. **Add Migration Utilities**
   - Create helper functions to convert old config to new config
   - Add validation for both config formats

### Phase 3: Deprecation Warnings (Future)

1. **Add Deprecation Warnings**
   - Log warnings when old configuration properties are used
   - Provide clear migration path in warning messages

2. **Update Examples**
   - Update all examples to use new configuration format
   - Keep old examples with deprecation notes

## Implementation Details

### 1. New Configuration Interface

```typescript
// New interface matching client SDK
export interface BKTConfig {
  apiKey: string;                         // Maps to: token
  apiEndpoint: string;                    // Maps to: host  
  featureTag: string;                     // Maps to: tag
  appVersion?: string;                    // New property
  pollingInterval?: number;               // Maps to: cachePollingInterval
  eventsFlushInterval?: number;           // Maps to: pollingIntervalForRegisterEvents
  eventsMaxQueueSize?: number;            // New property
  logger?: Logger;                        // Same as existing
  enableLocalEvaluation?: boolean;        // Same as existing
  // Server-specific extensions
  storageKeyPrefix?: string;              // New property (server-specific)
  userAgent?: string;                     // New property (server-specific)
}

// Backward compatibility - keep existing interface
export interface Config {
  host: string;
  token: string;
  tag: string;
  pollingIntervalForRegisterEvents?: number;
  logger?: Logger;
  enableLocalEvaluation?: boolean;
  cachePollingInterval?: number;
}
```

### 2. Configuration Mapping Functions

```typescript
// Convert new BKTConfig to internal Config
function bktConfigToConfig(bktConfig: BKTConfig): Config {
  return {
    host: bktConfig.apiEndpoint,
    token: bktConfig.apiKey,
    tag: bktConfig.featureTag,
    pollingIntervalForRegisterEvents: bktConfig.eventsFlushInterval,
    cachePollingInterval: bktConfig.pollingInterval,
    logger: bktConfig.logger,
    enableLocalEvaluation: bktConfig.enableLocalEvaluation,
  };
}

// Convert old Config to new BKTConfig
function configToBktConfig(config: Config): BKTConfig {
  return {
    apiEndpoint: config.host,
    apiKey: config.token,
    featureTag: config.tag,
    eventsFlushInterval: config.pollingIntervalForRegisterEvents,
    pollingInterval: config.cachePollingInterval,
    logger: config.logger,
    enableLocalEvaluation: config.enableLocalEvaluation,
  };
}
```

### 3. New Functions

```typescript
// New configuration helper (matches client SDK)
export const defineBKTConfig = (config: Partial<BKTConfig>): BKTConfig => {
  return {
    ...defaultBKTConfig,
    ...config,
  };
};

// New initialization function (matches client SDK pattern)
export function initializeBKTClient(config: BKTConfig): Bucketeer {
  const internalConfig = bktConfigToConfig(config);
  return initialize(internalConfig);
}

// Client instance getter (matches client SDK)
let globalClient: Bucketeer | null = null;

export function getBKTClient(): Bucketeer | null {
  return globalClient;
}

// Update initializeBKTClient to store global reference
export function initializeBKTClient(config: BKTConfig): Bucketeer {
  const internalConfig = bktConfigToConfig(config);
  globalClient = initialize(internalConfig);
  return globalClient;
}
```

### 4. Default Configuration Updates

```typescript
export const defaultBKTConfig: BKTConfig = {
  apiEndpoint: '',
  apiKey: '',
  featureTag: '',
  appVersion: '1.0.0',
  pollingInterval: 10 * 60 * 1000,        // 10 minutes (client SDK default)
  eventsFlushInterval: 30 * 1000,         // 30 seconds (client SDK default)
  eventsMaxQueueSize: 50,                 // 50 events (client SDK default)
  logger: new DefaultLogger(),
  enableLocalEvaluation: false,
  storageKeyPrefix: '',
  userAgent: 'Bucketeer-Node-Server-SDK',
};
```

### 5. Export Updates

```typescript
// Add to main exports in index.ts
export { BKTConfig, defineBKTConfig } from './config';
export { initializeBKTClient, getBKTClient } from './client';

// Keep existing exports for backward compatibility
export { Config } from './config';
export { initialize } from './initialize';
```

## Migration Examples

### Before (Current Usage)
```typescript
import { initialize } from '@bucketeer/node-server-sdk';

const config = {
  host: 'api-media.bucketeer.jp',
  token: 'your-api-key',
  tag: 'server',
  enableLocalEvaluation: true,
  cachePollingInterval: 10 * 60000,
};

const client = initialize(config);
```

### After (New Usage - Option 1)
```typescript
import { initializeBKTClient, defineBKTConfig, getBKTClient } from '@bucketeer/node-server-sdk';

const config = defineBKTConfig({
  apiEndpoint: 'api-media.bucketeer.jp',
  apiKey: 'your-api-key',
  featureTag: 'server',
  appVersion: '1.0.0',
  enableLocalEvaluation: true,
  pollingInterval: 10 * 60000,
});

initializeBKTClient(config);
const client = getBKTClient();
```

### After (New Usage - Option 2)
```typescript
import { initializeBKTClient } from '@bucketeer/node-server-sdk';

const client = initializeBKTClient({
  apiEndpoint: 'api-media.bucketeer.jp',
  apiKey: 'your-api-key',
  featureTag: 'server',
  appVersion: '1.0.0',
  enableLocalEvaluation: true,
  pollingInterval: 10 * 60000,
});
```

## Backward Compatibility Strategy

### 1. No Breaking Changes
- All existing `Config` interface properties remain unchanged
- Existing `initialize()` function continues to work exactly as before
- All existing method signatures preserved
- No changes to default behaviors

### 2. Dual Support
- Both old and new configuration formats supported simultaneously
- Both old and new initialization patterns supported
- Internal implementation handles both formats seamlessly

### 3. Gradual Migration Path
- Developers can migrate incrementally
- Old and new patterns can coexist in the same codebase
- No forced migration timeline

## Testing Strategy

### 1. Compatibility Tests
- Ensure all existing functionality works unchanged
- Test both old and new configuration formats
- Verify backward compatibility with existing applications

### 2. Integration Tests
- Test new configuration mapping logic
- Validate default value handling for new properties
- Test error handling for invalid configurations

### 3. Migration Tests
- Test conversion between old and new config formats
- Verify that equivalent configurations produce identical behavior
- Test edge cases and validation scenarios

## Benefits of This Approach

### 1. Consistency
- Aligns server SDK with client SDK naming conventions
- Provides familiar API for developers using both SDKs
- Reduces cognitive load when switching between SDKs

### 2. Zero Breaking Changes
- Existing applications continue to work without modification
- No forced migration or version compatibility issues
- Gradual adoption path for new features

### 3. Enhanced Functionality
- Adds new configuration options found in client SDK
- Provides better defaults aligned with client SDK
- Enables future feature parity between SDKs

### 4. Improved Developer Experience
- Consistent naming across Bucketeer SDK ecosystem
- Clear migration path with comprehensive documentation
- Better alignment with Bucketeer platform conventions

## Implementation Timeline

### Week 1-2: Core Implementation
- Implement new BKTConfig interface
- Add configuration mapping functions
- Implement new initialization functions
- Add default configuration updates

### Week 3: Integration & Testing
- Integrate with existing codebase
- Add comprehensive test coverage
- Test backward compatibility
- Validate migration scenarios

### Week 4: Documentation & Examples
- Update documentation with new patterns
- Create migration guide
- Update examples and README
- Add JSDoc comments for new APIs

## Conclusion

This refactor plan provides a path to align the Node.js Server-Side SDK with the Client-Side JavaScript SDK naming conventions while maintaining complete backward compatibility. The implementation will:

1. **Add new configuration options** that match client SDK naming
2. **Provide new initialization functions** that follow client SDK patterns  
3. **Maintain existing APIs** to prevent breaking changes
4. **Enable gradual migration** for existing applications
5. **Improve consistency** across the Bucketeer SDK ecosystem

The plan prioritizes backward compatibility while providing clear benefits and a smooth migration path for developers who want to adopt the new, more consistent configuration format.
