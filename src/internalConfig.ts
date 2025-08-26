import { BKTConfig } from './config';
import { IllegalArgumentError } from './objects/errors';
import { SourceId, sourceIdFromNumber } from './objects/sourceId';
import { nodeSDKVersion } from './objects/version';

// The internal config is used for the SDK's internal use only
// and should not be exposed to the user.
// The intent is not exposing the `SourceId` to the user
interface InternalConfig extends BKTConfig {
  sourceId: SourceId;
  sdkVersion: string;
}

const supportedWrapperSdkSourceIds: SourceId[] = [SourceId.OPEN_FEATURE_NODE];

const requiredInternalConfig = (config: BKTConfig): InternalConfig => {
  const internalConfig = config as InternalConfig;

  // sourceId is a number enum - only check for undefined, not falsy values
  // (SourceId.UNKNOWN = 0 is a valid value)
  if (internalConfig.sourceId === undefined) {
    throw new IllegalArgumentError(
      'Config is missing sourceId. Must be processed by defineBKTConfig first.',
    );
  }

  // sdkVersion is a string - check for falsy values including empty string
  // (empty string "" should be considered invalid for version)
  if (!internalConfig.sdkVersion) {
    throw new IllegalArgumentError(
      'Config is missing sdkVersion. Must be processed by defineBKTConfig first.',
    );
  }

  return internalConfig;
};

function resolveSourceId(config: BKTConfig): SourceId {
  if (config.wrapperSdkSourceId !== undefined) {
    const wrapperSdkSourceId = sourceIdFromNumber(config.wrapperSdkSourceId);
    if (supportedWrapperSdkSourceIds.includes(wrapperSdkSourceId)) {
      return wrapperSdkSourceId;
    }
    throw new IllegalArgumentError(`Unsupported wrapperSdkSourceId: ${config.wrapperSdkSourceId}`);
  }
  return SourceId.NODE_SERVER;
}

function resolveSDKVersion(config: BKTConfig, resolvedSourceId: SourceId): string {
  if (resolvedSourceId !== SourceId.NODE_SERVER) {
    if (config.wrapperSdkVersion) {
      return config.wrapperSdkVersion;
    }
    throw new IllegalArgumentError('Config is missing wrapperSdkVersion');
  }
  return nodeSDKVersion;
}

export { requiredInternalConfig, supportedWrapperSdkSourceIds, resolveSourceId, resolveSDKVersion };

export type { InternalConfig };
