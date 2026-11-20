import test, { ExecutionContext } from 'ava';
import { Logger, User, defineBKTConfig, initializeBKTClient } from '../../lib';
import { APIClient } from '../../lib/api/client';
import { BKTClientImpl } from '../../lib/client';
import { Evaluation } from '../../lib/objects/evaluation';
import { Event } from '../../lib/objects/event';
import { EvaluationEvent, isEvaluationEvent } from '../../lib/objects/evaluationEvent';
import { HoldoutGroup, HoldoutGroupFeature } from '../../lib/objects/holdout';
import { RegisterEventsResponse } from '../../lib/objects/response';
import { SourceId } from '../../lib/objects/sourceId';
import { nodeSDKVersion } from '../../lib/objects/version';
import {
  API_ENDPOINT,
  SCHEME,
  CLIENT_API_KEY,
  SERVER_API_KEY,
  FEATURE_TAG,
} from '../constants/constants';

/**
 * E2E test for holdout groups.
 *
 * A holdout group is not a permanent fixture: it has a stop date, only one
 * group can serve per environment, and it can only be created with the web
 * API. So the test is skipped unless HOLDOUT_FEATURE_ID is set, and a plain
 * `make e2e` does not run it.
 *
 * It requires the following in the test environment (Bucketeer server 2.4.0
 * or later):
 *
 * Flag HOLDOUT_FEATURE_ID (string, tag `nodejs`, enabled):
 *   - A fixed default strategy, and no targeting rule
 *
 * Holdout group in the RUNNING status:
 *   - Targets the flag with a holdout variation that is not the variation of
 *     the default strategy
 *   - HASH: a percentage large enough to hold out some of the HOLDOUT_USERS
 *     users (20% is plenty)
 *   - SEGMENT: a segment that no flag rule references. Set
 *     HOLDOUT_SEGMENT_USER_ID to one of its users
 *
 * Environment variables, next to the ones every e2e test needs:
 *   - HOLDOUT_FEATURE_ID: the flag ID. The test is skipped when it is empty
 *   - HOLDOUT_SEGMENT_USER_ID: a user of the segment, for a SEGMENT group
 *   - HOLDOUT_SERVING: `false` after the group is stopped, to verify that
 *     nobody is held out
 *
 * Run it with the whole suite, with the variables in `.env` or in the
 * environment:
 *   make build
 *   HOLDOUT_FEATURE_ID=<flag ID> make e2e
 *
 * The test verifies the events the SDK sends and that the server accepts
 * them, not what the server stores.
 */
const HOLDOUT_FEATURE_ID = process.env.HOLDOUT_FEATURE_ID ?? '';
const HOLDOUT_SEGMENT_USER_ID = process.env.HOLDOUT_SEGMENT_USER_ID ?? '';
const HOLDOUT_SERVING = process.env.HOLDOUT_SERVING !== 'false';

// The number of users evaluated locally and by the server.
const HOLDOUT_USERS = 300;
// A holdout change reaches the gateway within seconds. The worst case is a
// missed cache refresh and an expired in-memory cache.
const PROPAGATION_TIMEOUT_MS = 150_000;
const SERVER_ATTEMPTS = 3;
const TEST_TIMEOUT_MS = 10 * 60 * 1000;

// APIClient takes the host without the scheme.
const API_HOST = (API_ENDPOINT ?? '').replace(/^https?:\/\//, '');

type HoldoutTarget = { group: HoldoutGroup; feature: HoldoutGroupFeature };

type RegisteredBatch = {
  events: Event[];
  outcome: Promise<{ response?: RegisterEventsResponse; error?: unknown }>;
};

// Keeps the warnings and the errors of the SDK, so the test can report them.
class RecordingLogger implements Logger {
  readonly warnings: string[] = [];
  readonly errors: string[] = [];

  error(...args: unknown[]): void {
    this.errors.push(args.map(String).join(' '));
  }
  warn(...args: unknown[]): void {
    this.warnings.push(args.map(String).join(' '));
  }
  info(): void {}
  debug(): void {}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Calls fn until it returns true or the time is over.
async function eventually(
  fn: () => Promise<boolean>,
  timeoutMs: number,
  intervalMs: number,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    if (await fn()) {
      return true;
    }
    if (Date.now() + intervalMs > deadline) {
      return false;
    }
    await sleep(intervalMs);
  }
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// Returns the holdout group that targets the flag in the getFeatureFlags
// response. It reads the JSON the gateway really sends, which the unit tests
// can only imitate.
async function findHoldoutTarget(
  featureId: string,
): Promise<{ target?: HoldoutTarget; holdoutGroups?: HoldoutGroup[] }> {
  const client = new APIClient(API_HOST, SERVER_API_KEY);
  const [res] = await client.getFeatureFlags(
    FEATURE_TAG,
    '',
    0,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );
  if (!res.features.some((f) => f.id === featureId)) {
    throw new Error(
      `the flag ${featureId} is not delivered. It must be enabled and have the tag ${FEATURE_TAG}`,
    );
  }
  for (const group of res.holdoutGroups ?? []) {
    for (const feature of group.features ?? []) {
      if (feature.featureId === featureId) {
        return { target: { group, feature }, holdoutGroups: res.holdoutGroups };
      }
    }
  }
  return { holdoutGroups: res.holdoutGroups };
}

// Checks the fields the local evaluation depends on.
function assertHoldoutTarget(t: ExecutionContext, target: HoldoutTarget) {
  const { group, feature } = target;
  t.truthy(group.id);
  t.truthy(group.environmentId);
  t.true(['RUNNING', 'ANALYSIS'].includes(group.status), `status: ${group.status}`);
  t.is(feature.holdoutGroupId, group.id);
  t.truthy(feature.holdoutVariationId);
  switch (group.assignmentType) {
    case 'HASH':
      t.truthy(group.samplingSeed);
      t.true(group.percentage > 0, `percentage: ${group.percentage}`);
      break;
    case 'SEGMENT':
      t.truthy(group.segmentId);
      break;
    default:
      t.fail(`unknown assignment type: ${group.assignmentType}`);
  }
}

// Returns the evaluation of the server, which is what the local evaluation
// must match. The shared backend sometimes answers slowly, so a request that
// fails is sent again, and every failure is logged so that a slow backend is
// not mistaken for a holdout problem.
async function getServerEvaluation(
  t: ExecutionContext,
  client: APIClient,
  featureId: string,
  user: User,
): Promise<Evaluation> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= SERVER_ATTEMPTS; attempt++) {
    try {
      const [res] = await client.getEvaluation(
        FEATURE_TAG,
        user,
        featureId,
        SourceId.NODE_SERVER,
        nodeSDKVersion,
      );
      if (!res.evaluation || !res.evaluation.reason) {
        throw new Error(`the response has no evaluation or no reason: ${JSON.stringify(res)}`);
      }
      return res.evaluation;
    } catch (e) {
      lastError = e;
      t.log(
        `getEvaluation failed (attempt: ${attempt}/${SERVER_ATTEMPTS}, userId: ${user.id}): ${errorMessage(e)}`,
      );
      await sleep(5000);
    }
  }
  throw new Error(
    `the server did not evaluate ${user.id}. This is a request failure, not a holdout result: ` +
      errorMessage(lastError),
  );
}

function newHoldoutUsers(): User[] {
  const users: User[] = [];
  if (HOLDOUT_SEGMENT_USER_ID) {
    users.push({ id: HOLDOUT_SEGMENT_USER_ID, data: {} });
  }
  for (let i = 0; i < HOLDOUT_USERS; i++) {
    users.push({ id: `bucketeer-nodejs-server-holdout-user-id-${i}`, data: {} });
  }
  return users;
}

// Records every batch of events the SDK sends, and what the server answers.
function recordRegisteredEvents(client: BKTClientImpl): RegisteredBatch[] {
  const batches: RegisteredBatch[] = [];
  const apiClient = client.apiClient;
  const registerEvents = apiClient.registerEvents.bind(apiClient);
  apiClient.registerEvents = (events, sourceId, sdkVersion, signal) => {
    const result = registerEvents(events, sourceId, sdkVersion, signal);
    batches.push({
      events,
      outcome: result.then(
        ([response]) => ({ response }),
        (error: unknown) => ({ error }),
      ),
    });
    return result;
  };
  return batches;
}

// Returns the evaluation events of the flag, in the order the SDK created them.
function evaluationEventsOf(events: Event[], featureId: string): EvaluationEvent[] {
  return events
    .map((e) => e.event)
    .filter((e): e is EvaluationEvent => isEvaluationEvent(e) && e.featureId === featureId);
}

const holdoutTest = HOLDOUT_FEATURE_ID ? test.serial : test.serial.skip;

// Evaluates the same users locally and on the server. The server decides who
// is held out, so the test does not need to know the sampling seed of the group.
holdoutTest('holdout: the local evaluation matches the server', async (t) => {
  t.timeout(TEST_TIMEOUT_MS);
  const featureId = HOLDOUT_FEATURE_ID;

  // The group reaches the SDK in the getFeatureFlags response
  let target: HoldoutTarget | undefined;
  let lastError: unknown;
  let lastHoldoutGroups: HoldoutGroup[] | undefined;
  const delivered = await eventually(
    async () => {
      try {
        const found = await findHoldoutTarget(featureId);
        target = found.target;
        lastHoldoutGroups = found.holdoutGroups;
        lastError = undefined;
        return (target !== undefined) === HOLDOUT_SERVING;
      } catch (e) {
        lastError = e;
        return false;
      }
    },
    PROPAGATION_TIMEOUT_MS,
    2000,
  );
  if (!delivered) {
    // Tell a request that fails from a response without the group
    t.log(`the last error of getFeatureFlags: ${lastError ? errorMessage(lastError) : 'none'}`);
    t.log(`the holdoutGroups the gateway sends: ${JSON.stringify(lastHoldoutGroups)}`);
    t.fail(
      `getFeatureFlags must deliver a holdout group that targets ${featureId}: ${HOLDOUT_SERVING}`,
    );
    return;
  }
  if (HOLDOUT_SERVING) {
    assertHoldoutTarget(t, target!);
    t.log(`holdout group: ${JSON.stringify(target!.group)}`);
    if (target!.group.assignmentType === 'SEGMENT' && !HOLDOUT_SEGMENT_USER_ID) {
      // The generated users are not in the segment, so nobody would be held out
      t.fail(
        'the group has the SEGMENT assignment. Set HOLDOUT_SEGMENT_USER_ID to a user of its segment',
      );
      return;
    }
  }

  // The evaluations of the server
  const users = newHoldoutUsers();
  const expected = new Map<string, Evaluation>();
  const heldOut: User[] = [];
  const notHeldOut: User[] = [];
  const serverClient = new APIClient(API_HOST, CLIENT_API_KEY);
  const serverStart = Date.now();
  for (const user of users) {
    const evaluation = await getServerEvaluation(t, serverClient, featureId, user);
    expected.set(user.id, evaluation);
    if (evaluation.reason?.type === 'HOLDOUT') {
      heldOut.push(user);
    } else {
      notHeldOut.push(user);
    }
  }
  t.log(
    `server: ${heldOut.length} held-out users, ${notHeldOut.length} other users ` +
      `(${Math.round((Date.now() - serverStart) / 1000)}s)`,
  );

  if (HOLDOUT_SERVING) {
    // A run in which the server holds nobody out, or everybody, proves nothing
    if (heldOut.length === 0 || notHeldOut.length === 0) {
      t.fail(`the server holds ${heldOut.length === 0 ? 'no user' : 'every user'} out`);
      return;
    }
    for (const user of heldOut) {
      const evaluation = expected.get(user.id)!;
      t.is(evaluation.reason?.holdoutGroupId, target!.group.id, `userId: ${user.id}`);
      t.is(evaluation.variationId, target!.feature.holdoutVariationId, `userId: ${user.id}`);
    }
    if (HOLDOUT_SEGMENT_USER_ID) {
      t.is(target!.group.assignmentType, 'SEGMENT');
      t.is(
        expected.get(HOLDOUT_SEGMENT_USER_ID)?.reason?.type,
        'HOLDOUT',
        `the server does not hold the user of the segment out: ${HOLDOUT_SEGMENT_USER_ID}`,
      );
    }
  } else {
    t.is(heldOut.length, 0, 'the server still holds users out');
  }

  // The local evaluation
  const logger = new RecordingLogger();
  const client = initializeBKTClient(
    defineBKTConfig({
      apiEndpoint: API_ENDPOINT,
      scheme: SCHEME,
      apiKey: SERVER_API_KEY,
      featureTag: FEATURE_TAG,
      logger,
      enableLocalEvaluation: true,
      cachePollingInterval: 60_000,
    }),
  ) as BKTClientImpl;
  const batches = recordRegisteredEvents(client);
  try {
    await client.waitForInitialization({ timeout: 30_000 });
    if (HOLDOUT_SERVING) {
      // The SDK polls the flags and the segment users separately, so wait
      // until it holds the group, and the segment of a SEGMENT group
      const held = await eventually(
        async () =>
          (await client.stringVariationDetails(heldOut[0], featureId, 'default')).reason ===
          'HOLDOUT',
        PROPAGATION_TIMEOUT_MS,
        1000,
      );
      if (!held) {
        t.log(`SDK warnings: ${JSON.stringify(logger.warnings)}`);
        t.log(`SDK errors: ${JSON.stringify(logger.errors)}`);
        t.fail(`the local evaluation does not hold the user out: ${heldOut[0].id}`);
        return;
      }
    }
    let mismatches = 0;
    for (const user of users) {
      const evaluation = expected.get(user.id)!;
      const details = await client.stringVariationDetails(user, featureId, 'default');
      if (
        details.variationId !== evaluation.variationId ||
        details.variationValue !== evaluation.variationValue ||
        details.reason !== evaluation.reason?.type ||
        details.featureVersion !== evaluation.featureVersion
      ) {
        mismatches++;
        t.log(
          `userId: ${user.id}\n` +
            `  server: variation ${evaluation.variationId} (${evaluation.variationValue}), ` +
            `reason ${evaluation.reason?.type}, version ${evaluation.featureVersion}\n` +
            `  local:  variation ${details.variationId} (${details.variationValue}), ` +
            `reason ${details.reason}, version ${details.featureVersion}`,
        );
      }
    }
    t.log(`local: ${mismatches} of ${users.length} users differ from the server`);
    t.is(mismatches, 0, 'the local evaluation differs from the server');
  } finally {
    // The remaining events are sent here
    await client.destroy();
  }

  // The server must accept every event
  let sent = 0;
  let failedBatches = 0;
  const sentEvents: Event[] = [];
  for (const batch of batches) {
    const { response, error } = await batch.outcome;
    const rejected = Object.keys(response?.errors ?? {});
    if (error !== undefined || rejected.length > 0) {
      failedBatches++;
      t.log(
        `registerEvents failed (${batch.events.length} events): ` +
          (error !== undefined ? errorMessage(error) : JSON.stringify(response?.errors)),
      );
      continue;
    }
    sent += batch.events.length;
    sentEvents.push(...batch.events);
  }
  t.log(
    `events: ${sent} sent in ${batches.length} batches, ${failedBatches} failed batches, ` +
      `${client.eventStore.size()} not sent`,
  );
  t.is(failedBatches, 0, 'the server did not accept every batch of events');
  t.is(client.eventStore.size(), 0, 'some events were not sent');

  // The last evaluation event of every user has the reason of the server,
  // and the holdout group ID when the user is held out
  const lastEvents = new Map<string, EvaluationEvent>();
  for (const event of evaluationEventsOf(sentEvents, featureId)) {
    lastEvents.set(event.userId, event);
  }
  let wrongEvents = 0;
  for (const user of users) {
    const evaluation = expected.get(user.id)!;
    const event = lastEvents.get(user.id);
    if (
      event === undefined ||
      event.reason?.type !== evaluation.reason?.type ||
      (event.reason?.holdoutGroupId ?? '') !== (evaluation.reason?.holdoutGroupId ?? '') ||
      event.variationId !== evaluation.variationId ||
      event.featureVersion !== evaluation.featureVersion
    ) {
      wrongEvents++;
      t.log(
        `userId: ${user.id}\n` +
          `  server: ${JSON.stringify(evaluation.reason)}, variation ${evaluation.variationId}\n` +
          `  event:  ${JSON.stringify(event?.reason)}, variation ${event?.variationId}`,
      );
    }
  }
  t.log(`events: ${wrongEvents} of ${users.length} users have a wrong evaluation event`);
  t.is(wrongEvents, 0, 'the evaluation events differ from the server');

  if (logger.warnings.length > 0) {
    t.log(`SDK warnings: ${JSON.stringify(logger.warnings)}`);
  }
  t.deepEqual(logger.errors, [], 'the SDK logged errors');

  // The remote evaluation of the SDK reports the reason of the server, and
  // its evaluation event keeps the holdout group ID
  const remoteLogger = new RecordingLogger();
  const remoteClient = initializeBKTClient(
    defineBKTConfig({
      apiEndpoint: API_ENDPOINT,
      scheme: SCHEME,
      apiKey: CLIENT_API_KEY,
      featureTag: FEATURE_TAG,
      logger: remoteLogger,
    }),
  ) as BKTClientImpl;
  try {
    const user = HOLDOUT_SERVING ? heldOut[0] : notHeldOut[0];
    const evaluation = expected.get(user.id)!;
    const details = await remoteClient.stringVariationDetails(user, featureId, 'default');
    t.is<string | undefined, string | undefined>(
      details.reason,
      evaluation.reason?.type,
      `userId: ${user.id}`,
    );
    t.is(details.variationId, evaluation.variationId, `userId: ${user.id}`);
    const [event] = evaluationEventsOf(remoteClient.eventStore.getAll(), featureId);
    t.truthy(event, 'the remote evaluation created no evaluation event');
    t.is(event?.reason?.type, evaluation.reason?.type);
    t.is(event?.reason?.holdoutGroupId ?? '', evaluation.reason?.holdoutGroupId ?? '');
  } finally {
    await remoteClient.destroy();
  }
  t.deepEqual(remoteLogger.errors, [], 'the SDK logged errors in remote evaluation');
});
