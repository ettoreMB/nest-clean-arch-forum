import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presentes'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default(`1`)
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:id/answers')
export class FetchQuestionAnswersController {
  constructor(private fecthQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') questionId: string,
  ) {
    const result = await this.fecthQuestionAnswers.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers
    return { answers: answers.map(AnswerPresenter.toHTTP) }
  }
}
