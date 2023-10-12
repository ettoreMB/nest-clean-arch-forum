import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('fetch question comments  e2e', () => {
  let app: INestApplication
  let jwt: JwtService
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })
  test('[GET]/questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Jhon Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'comment 1',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'comment 2',
      }),
    ])
    const questionId = question.id.toString()
    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    console.log(response.body)
    expect(response.body).toBe({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'comment 2', name: 'Jhon Doe' }),
        expect.objectContaining({ content: 'comment 1', name: 'Jhon Doe' }),
      ]),
    })
  })
})
