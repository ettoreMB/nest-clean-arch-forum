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

describe('comment on answer (E2E)', () => {
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
  test('[POST] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const jwt = jwtService.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        content: `new answer comment`,
      })

    expect(response.statusCode).toBe(204)

    const commentDb = await prisma.comment.findFirst({
      where: {
        content: 'new answer comment',
      },
    })

    expect(commentDb).toBeTruthy()
  })
})
