import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const modeleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory, AnswerFactory],
    }).compile()

    app = modeleRef.createNestApplication()
    questionFactory = modeleRef.get(QuestionFactory)
    studentFactory = modeleRef.get(StudentFactory)
    answerFactory = modeleRef.get(AnswerFactory)
    jwt = modeleRef.get(JwtService)
    prisma = modeleRef.get(PrismaService)

    await app.init()
  })

  test('[PUT]/answers/:id', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accesToken = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: student.id,
    })
    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accesToken}`)
      .send({
        content: 'New answer content',
        attachmentIds: ['1', '2'],
      })

    expect(response.statusCode).toBe(204)

    const answerDB = prisma.answer.findFirst({
      where: {
        content: 'New answer content',
      },
    })

    expect(answerDB).toBeTruthy()
  })
})
