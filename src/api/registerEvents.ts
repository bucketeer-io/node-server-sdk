import { Result } from 'option-t/lib/PlainResult/Result';
import { Maybe } from 'option-t/lib/Maybe/Maybe';
import { v4 } from 'uuid';
import { EvaluationEvent, EvaluationEventAsPlainObject } from '../objects/EvaluationEvent';
import { GoalEvent, GoalEventAsPlainObject } from '../objects/GoalEvent';
import { MetricsEvent, MetricsEventAsPlainObject } from '../objects/MetricsEvent';
import { Host, Token } from '../shared';
import { PostFn, post } from './shared';

export type RegisterEventsRequest = {
  events: Array<{
    id: string;
    event: EvaluationEventAsPlainObject | GoalEventAsPlainObject | MetricsEventAsPlainObject;
  }>;
};

export type RegisterEventsResponse = {
  errors?: Maybe<
    Array<{
      retriable: boolean;
      message: string;
    }>
  >;
};

export type RegisterEventsResult = Result<RegisterEventsResponse, Error>;

type RegisterEventsFn = (
  events: Array<EvaluationEvent | GoalEvent | MetricsEvent>,
) => Promise<RegisterEventsResult>;

export const createRegisterEventsAPI = (
  host: Host,
  token: Token,
  api: PostFn<RegisterEventsRequest, RegisterEventsResponse> = post,
): RegisterEventsFn => {
  return function registerEvents(
    events: Array<EvaluationEvent | GoalEvent | MetricsEvent>,
  ): Promise<RegisterEventsResult> {
    return api(`${host}/register_events`, token, {
      events: events.map((event) => {
        return {
          id: v4(),
          event: event.toPlainObject(),
        };
      }),
    });
  };
};
