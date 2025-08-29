import { http, HttpResponse } from 'msw';
import { SetupServer } from 'msw/node';
import anyTest, { TestFn } from 'ava';
import { Bucketeer, initialize, initializeBKTClient } from '..';
import { Config, User } from '../bootstrap';
import { DefaultLogger } from '../logger';
import { setupServerAndListen } from './utils/setup_server';
import { GetEvaluationResponse } from '../objects/response';
import { GetEvaluationRequest } from '../objects/request';
import { newDefaultBKTEvaluationDetails } from '../evaluationDetails';
import { BKTConfig, defineBKTConfig } from '../config';

const scheme = 'https://';
const host = 'api.bucketeer.io';
const evaluationAPI = `${scheme}${host}/get_evaluation`;

const test = anyTest as TestFn<{
  bktClient: Bucketeer;
  targetedUser: User;
  config: BKTConfig;
  server: SetupServer;
}>;

test.before((t) => {
  const config = defineBKTConfig({
    apiEndpoint: 'api.bucketeer.io',
    apiKey: 'api_key_value',
    featureTag: 'feature_tag_value',
    logger: new DefaultLogger('error'),
  });
  t.context = {
    bktClient: initializeBKTClient(config),
    targetedUser: { id: 'user_id', data: {} },
    config: config,
    server: setupServerAndListen(),
  };
});

test.serial('getEvaluation: default evaluation details', async (t) => {
  const featureId = 'stringEvaluationDetails';
  t.context.server.use(
    http.post(evaluationAPI, () => {
      return HttpResponse.error();
    }),
  );
  const client = t.context.bktClient;
  const user = t.context.targetedUser;

  t.is(await client.stringVariation(user, featureId, 'default-test'), 'default-test');

  t.deepEqual(
    await client.stringVariationDetails(user, featureId, 'default-test'),
    newDefaultBKTEvaluationDetails(user.id, featureId, 'default-test'),
  );

  t.is(await client.booleanVariation(user, featureId, true), true);

  t.deepEqual(
    await client.booleanVariationDetails(user, featureId, true),
    newDefaultBKTEvaluationDetails(user.id, featureId, true),
  );

  t.is(await client.numberVariation(user, featureId, 2), 2);

  t.deepEqual(
    await client.numberVariationDetails(user, featureId, 1),
    newDefaultBKTEvaluationDetails(user.id, featureId, 1),
  );

  t.deepEqual(await client.objectVariation(user, featureId, [1, 3, 5]), [1, 3, 5]);

  t.deepEqual(
    await client.objectVariationDetails(user, featureId, { key: 1 }),
    newDefaultBKTEvaluationDetails(user.id, featureId, { key: 1 }),
  );
});

test.serial('getEvaluation: stringEvaluationDetails', async (t) => {
  const featureId = 'stringEvaluationDetails';
  const dummyEvalResponse: GetEvaluationResponse = {
    evaluation: {
      id: 'id_test',
      featureId: featureId,
      featureVersion: 2,
      userId: 'user_id',
      variationId: 'variationId',
      reason: {
        type: 'DEFAULT',
      },
      variationValue: 'value-1',
      variationName: 'name',
    },
  };
  t.context.server.use(
    http.post<Record<string, never>, GetEvaluationRequest, GetEvaluationResponse>(
      evaluationAPI,
      () => {
        return HttpResponse.json(dummyEvalResponse);
      },
    ),
  );
  const client = t.context.bktClient;
  const user = t.context.targetedUser;

  t.is(await client.stringVariation(user, featureId, 'default-test'), 'value-1');

  t.deepEqual(await client.stringVariationDetails(user, featureId, 'test'), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: 'value-1',
    reason: 'DEFAULT',
  });

  t.deepEqual(
    await client.booleanVariationDetails(user, featureId, true),
    newDefaultBKTEvaluationDetails(user.id, featureId, true),
  );

  t.deepEqual(
    await client.numberVariationDetails(user, featureId, 1),
    newDefaultBKTEvaluationDetails(user.id, featureId, 1),
  );

  t.deepEqual(
    await client.objectVariationDetails(user, featureId, {}),
    newDefaultBKTEvaluationDetails(user.id, featureId, {}),
  );
});

test.serial('getEvaluation: boolEvaluationDetails', async (t) => {
  const featureId = 'boolEvaluationDetails';
  const dummyEvalResponse: GetEvaluationResponse = {
    evaluation: {
      id: 'id_test',
      featureId: featureId,
      featureVersion: 2,
      userId: 'user_id',
      variationId: 'variationId',
      reason: {
        type: 'DEFAULT',
      },
      variationValue: 'true',
      variationName: 'name',
    },
  };
  t.context.server.use(
    http.post<Record<string, never>, GetEvaluationRequest, GetEvaluationResponse>(
      evaluationAPI,
      () => {
        return HttpResponse.json(dummyEvalResponse);
      },
    ),
  );
  const client = t.context.bktClient;
  const user = t.context.targetedUser;

  t.is(await client.booleanVariation(user, featureId, false), true);

  t.deepEqual(await client.booleanVariationDetails(user, featureId, false), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: true,
    reason: 'DEFAULT',
  });

  t.deepEqual(await client.stringVariationDetails(user, featureId, ''), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: 'true',
    reason: 'DEFAULT',
  });

  t.deepEqual(
    await client.numberVariationDetails(user, featureId, 1),
    newDefaultBKTEvaluationDetails(user.id, featureId, 1),
  );

  t.deepEqual(
    await client.objectVariationDetails(user, featureId, {}),
    newDefaultBKTEvaluationDetails(user.id, featureId, {}),
  );
});

test.serial('getEvaluation: numberEvaluationDetails', async (t) => {
  const featureId = 'numberEvaluationDetails';
  const dummyEvalResponse: GetEvaluationResponse = {
    evaluation: {
      id: 'id_test',
      featureId: featureId,
      featureVersion: 2,
      userId: 'user_id',
      variationId: 'variationId',
      reason: {
        type: 'DEFAULT',
      },
      variationValue: '1.2',
      variationName: 'name',
    },
  };
  t.context.server.use(
    http.post<Record<string, never>, GetEvaluationRequest, GetEvaluationResponse>(
      evaluationAPI,
      () => {
        return HttpResponse.json(dummyEvalResponse);
      },
    ),
  );
  const client = t.context.bktClient;
  const user = t.context.targetedUser;

  t.is(await client.numberVariation(user, featureId, 1), 1.2);

  t.deepEqual(await client.numberVariationDetails(user, featureId, 2), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: 1.2,
    reason: 'DEFAULT',
  });

  t.deepEqual(await client.stringVariationDetails(user, featureId, ''), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: '1.2',
    reason: 'DEFAULT',
  });

  t.deepEqual(
    await client.booleanVariationDetails(user, featureId, true),
    newDefaultBKTEvaluationDetails(user.id, featureId, true),
  );

  t.deepEqual(
    await client.objectVariationDetails(user, featureId, {}),
    newDefaultBKTEvaluationDetails(user.id, featureId, {}),
  );
});

test.serial('getEvaluation: objectEvaluationDetails', async (t) => {
  const featureId = 'stringEvaluationDetails';
  const dummyEvalResponse: GetEvaluationResponse = {
    evaluation: {
      id: 'id_test',
      featureId: featureId,
      featureVersion: 2,
      userId: 'user_id',
      variationId: 'variationId',
      reason: {
        type: 'DEFAULT',
      },
      variationValue: JSON.stringify({ key: 'value1', array: [1, 2, 3] }),
      variationName: 'name',
    },
  };
  t.context.server.use(
    http.post<Record<string, never>, GetEvaluationRequest, GetEvaluationResponse>(
      evaluationAPI,
      () => {
        return HttpResponse.json(dummyEvalResponse);
      },
    ),
  );
  const client = t.context.bktClient;
  const user = t.context.targetedUser;

  t.is(
    await client.stringVariation(user, featureId, 'default-test'),
    JSON.stringify({ key: 'value1', array: [1, 2, 3] }),
  );

  t.deepEqual(await client.stringVariationDetails(user, featureId, 'test'), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: JSON.stringify({ key: 'value1', array: [1, 2, 3] }),
    reason: 'DEFAULT',
  });

  t.deepEqual(
    await client.booleanVariationDetails(user, featureId, true),
    newDefaultBKTEvaluationDetails(user.id, featureId, true),
  );

  t.deepEqual(
    await client.numberVariationDetails(user, featureId, 1),
    newDefaultBKTEvaluationDetails(user.id, featureId, 1),
  );

  t.deepEqual(await client.objectVariation(user, featureId, {}), {
    key: 'value1',
    array: [1, 2, 3],
  });

  t.deepEqual(await client.objectVariationDetails(user, featureId, {}), {
    featureId: featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variationId',
    variationName: 'name',
    variationValue: { key: 'value1', array: [1, 2, 3] },
    reason: 'DEFAULT',
  });
});

test.afterEach.always((t) => {
  t.context.server.resetHandlers();
});

test.after.always((t) => {
  t.context.server.close();
  t.context.bktClient.destroy();
});
