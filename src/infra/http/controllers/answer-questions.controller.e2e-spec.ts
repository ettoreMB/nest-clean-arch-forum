import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Answer question (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwtService: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const modeleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = modeleRef.createNestApplication()

    prisma = modeleRef.get(PrismaService)
    studentFactory = modeleRef.get(StudentFactory)
    questionFactory = modeleRef.get(QuestionFactory)
    jwtService = modeleRef.get(JwtService)

    await app.init()
  })

  test('[POST]/questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const jwt = jwtService.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        content: 'New Answer',
      })

    expect(response.statusCode).toBe(201)

    const answerDb = await prisma.answer.findFirst({
      where: {
        content: 'New Answer',
      },
    })

    expect(answerDb).toBeTruthy()
  })
})
