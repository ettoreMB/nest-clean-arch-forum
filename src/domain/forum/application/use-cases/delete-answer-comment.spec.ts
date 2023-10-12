import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryCommentAnswersRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('delete answer comment test', () => {
  beforeEach(() => {
    inMemoryCommentAnswersRepository = new InMemoryAnswerCommentsRepository()

    sut = new DeleteAnswerCommentUseCase(inMemoryCommentAnswersRepository)
  })

  it('should be able to delete comment answer', async () => {
    const answer = makeAnswerComment()
    await inMemoryCommentAnswersRepository.create(answer)

    const result = await sut.execute({
      answerCommentId: answer.id.toString(),
      authorId: answer.authorId.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCommentAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answer = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })
    await inMemoryCommentAnswersRepository.create(answer)
    const result = await sut.execute({
      answerCommentId: answer.id.toString(),
      authorId: 'author2',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
