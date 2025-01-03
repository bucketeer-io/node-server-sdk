import { User } from './objects/user'

/**
 * Asserts that the provided user and featureID are valid for an evaluation request.
 *
 * @param user - The user object to be validated.
 * @param featureID - The feature ID to be validated.
 * @throws Will throw an error if the user is invalid or if the featureID is not provided.
 */
function assertGetEvaluationRequest(user: User, featureID: string) {
  if (!user) {
    throw new Error('user is null or undefined')
  }

  if (!user.id) {
    throw new Error('userID is empty')
  }

  if (!featureID) {
    throw new Error('featureID is required')
  }
}

export { assertGetEvaluationRequest }