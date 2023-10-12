import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachements-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let answerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

test('Answer-Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      InMemoryAnswerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(answerRepository)
  })

  it('Should be able to answer an  question', async () => {
    const result = await sut.execute({
      content: 'Nova Resposta',
      authorId: '1',
      questionId: '1',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight).toBeTruthy()
    expect(result.value?.answer.content).toEqual('Nova Resposta')
    expect(answerRepository.items[0]).toEqual(result.value?.answer)
    expect(answerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
    expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2)
  })

  it('should persist attachments when answer a question', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'New question content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBeTruthy()

    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]),
    )
  })
})
