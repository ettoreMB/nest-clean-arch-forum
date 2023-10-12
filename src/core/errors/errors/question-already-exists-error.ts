import { UseCaseError } from '@/core/errors/use-case-error'

export class QuestionsAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Resource already exists')
  }
}
