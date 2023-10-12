import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('comment on question (E2E)', () => {
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
  test('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const jwt = jwtService.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        content: `new comment`,
      })
    expect(response.statusCode).toBe(204)

    const commentDb = await prisma.comment.findFirst({
      where: {
        content: 'new comment',
      },
    })

    expect(commentDb).toBeTruthy()
  })
})
