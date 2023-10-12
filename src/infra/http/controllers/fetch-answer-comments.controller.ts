import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { CommentPresenters } from '../presenters/comment-presenters'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fecth-answer-comments'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default(`1`)
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:id/comments')
export class FetchAnswerCommentsController {
  constructor(private fecthAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') answerId: string,
  ) {
    const result = await this.fecthAnswerComments.execute({
      answerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questionComments = result.value.answerComments
    return { comments: questionComments.map(CommentPresenters.toHTTP) }
  }
}
