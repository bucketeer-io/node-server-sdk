import { createOk, createErr, Result } from 'option-t/lib/PlainResult/Result';
import { Maybe } from 'option-t/lib/Maybe/Maybe';
import { unwrapUndefinable } from 'option-t/lib/Undefinable/unwrap';
import { unwrapOrFromMaybe } from 'option-t/lib/Maybe/unwrapOr';
import { mapOrForMaybe } from 'option-t/lib/Maybe/mapOr';
import { convertRawToEvaluation, Evaluation, EvaluationAsPlainObject } from '../objects/Evaluation';
import { UserAsPlainObject } from '../objects/User';
import { Host, Token, Tag, UserEvaluationsId } from '../shared';
import { SourceId } from '../objects/SourceId';
import { PostFn, post } from './shared';

export enum GetEvaluationState {
  QUEUED = 'QUEUED',
  PARTIAL = 'PARTIAL',
  FULL = 'FULL',
}

export type PlainResponse = {
  evaluation: Maybe<any>;
};

export type GetEvaluationResponse = {
  evaluation: Evaluation;
};

export type GetEvaluationRequest = {
  sourceId: SourceId;
  tag: Tag;
  user: UserAsPlainObject;
  featureId: string;
};

export type GetEvaluationResult = Result<GetEvaluationResponse, Error>;

type GetEvaluationFn = (
  tag: Tag,
  user: UserAsPlainObject,
  featureId: string,
) => Promise<GetEvaluationResult>;

export const createGetEvaluationAPI = (
  host: Host,
  token: Token,
  api: PostFn<GetEvaluationRequest, PlainResponse> = post,
): GetEvaluationFn => {
  return function getEvaluation(
    tag: Tag,
    user: UserAsPlainObject,
    featureId: string,
  ): Promise<GetEvaluationResult> {
    return api(`${host}/get_evaluation`, token, {
      sourceId: SourceId.NODE_SERVER,
      tag,
      user: user,
      featureId,
    }).then((res) => {
      if (!res.ok) {
        return res;
      }
      const raw = convertRawToEvaluation(res.val.evaluation);
      // TODO:
      if (!raw.ok) {
        return res;
      }
      const evaluation = unwrapUndefinable(raw.val);
      return createOk({ evaluation });
    });
  };
};
