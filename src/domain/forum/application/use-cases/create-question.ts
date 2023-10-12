import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'
import { QuestionsAlreadyExistsError } from '@/core/errors/errors/question-already-exists-error'
interface CreateQuestionUseCaseRequest {
  authorId: string
  content: string
  title: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  QuestionsAlreadyExistsError,
  {
    question: Question
  }
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    const slugExists = await this.questionRepository.findBySlug(
      question.slug.value,
    )

    if (slugExists) {
      return left(new QuestionsAlreadyExistsError())
    }
    await this.questionRepository.create(question)

    return right({ question })
  }
}
