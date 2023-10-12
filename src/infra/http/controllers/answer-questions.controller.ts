import {
  Controller,
  HttpCode,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const answerQuestionValidationPipe = new ZodValidationPipe(
  answerQuestionBodySchema,
)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(answerQuestionValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const userId = user.sub
    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
