import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswersAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}
  createMany(attachments: AnswerAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const result = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return result.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
