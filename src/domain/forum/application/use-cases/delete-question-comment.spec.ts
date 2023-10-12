import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryCommentQuestionsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('delete question comment test', () => {
  beforeEach(() => {
    inMemoryCommentQuestionsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new DeleteQuestionCommentUseCase(inMemoryCommentQuestionsRepository)
  })

  it('should be able to delete comment question', async () => {
    const question = makeQuestionComment()
    await inMemoryCommentQuestionsRepository.create(question)

    await sut.execute({
      questionCommentId: question.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryCommentQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const question = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })
    await inMemoryCommentQuestionsRepository.create(question)

    const result = await sut.execute({
      questionCommentId: question.id.toString(),
      authorId: 'author2',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
