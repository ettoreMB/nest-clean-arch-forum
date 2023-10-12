import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { DomainEvent } from '../../../../core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, besAnswerId: UniqueEntityID) {
    this.question = question
    this.bestAnswerId = besAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
