
import { Evaluation } from '../objects/evaluation';
import { User } from '../objects/user';

// Node.js evaluator interface. This interface is used to evaluate the feature flag for the given user.
// Prefix `Node` is used to avoid conflict with the evaluator interface in the `@kenji71089/evaluation` package.
interface NodeEvaluator {
  evaluate(user: User, featureID: string): Promise<Evaluation>;
}

export { NodeEvaluator}