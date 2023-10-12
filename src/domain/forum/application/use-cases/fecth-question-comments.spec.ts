import { FetchQuestionCommentsUseCase } from './fecth-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: FetchQuestionCommentsUseCase

describe('fetch question comments test', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })
  test('should  be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)

    const comment1 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    })
    const comment2 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    })
    const comment3 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    })

    await inMemoryQuestionCommentsRepository.create(comment1)

    await inMemoryQuestionCommentsRepository.create(comment2)

    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })
    expect(result.value?.comments).toHaveLength(3)

    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
      ]),
    )
  })

  test('should  be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const { value } = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(value?.comments).toHaveLength(2)
  })
})
