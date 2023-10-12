import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from 'test/factories/make-answer'

describe('choose best question answer (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwtService: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const modeleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = modeleRef.createNestApplication()

    prisma = modeleRef.get(PrismaService)
    studentFactory = modeleRef.get(StudentFactory)
    questionFactory = modeleRef.get(QuestionFactory)
    answerFactory = modeleRef.get(AnswerFactory)
    jwtService = modeleRef.get(JwtService)

    await app.init()
  })
  test('[PATCH]/answers/:answerId/choose-as-best', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const jwt = jwtService.sign({ sub: user.id.toString() })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${jwt}`)

    expect(response.statusCode).toBe(204)

    const questionDb = await prisma.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    })

    expect(questionDb?.bestAnswerId).toEqual(answerId)
  })
})
