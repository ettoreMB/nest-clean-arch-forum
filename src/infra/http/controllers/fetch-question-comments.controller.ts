import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fecth-question-comments'
import { CommentWithAuthorPresenters } from '../presenters/comment-with-author-presenters'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default(`1`)
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:id/comments')
export class FetchQuestionsCommentsController {
  constructor(private fecthQuestionsComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') questionId: string,
  ) {
    const result = await this.fecthQuestionsComments.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questionComments = result.value.comments
    return {
      comments: questionComments.map(CommentWithAuthorPresenters.toHTTP),
    }
  }
}
