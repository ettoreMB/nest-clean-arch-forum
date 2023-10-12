import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository'
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-question-attachements-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answer-attachements-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/studentes-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-coment-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-coment-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionsAttachmentsRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswersAttachmentsRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentsRepository,
    AnswersRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerCommentRepository,
    AnswerAttachmentsRepository,
    AttachmentRepository,
  ],
})
export class DatabaseModule {}
