import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '../repositories/answer-coment-repository'
import { AnswersRepository } from '../repositories/answers-repository'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CommentOnAnswerRequest {
  authorId: string
  answerId: string
  content: string
}
type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answerCommentRepository: AnswerCommentRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityID(answerId),
      authorId: new UniqueEntityID(authorId),
      content,
    })
    await this.answerCommentRepository.create(answerComment)

    return right({
      answerComment,
    })
  }
}
