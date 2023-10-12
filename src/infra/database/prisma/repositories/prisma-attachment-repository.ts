import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prismService: PrismaService) {}
  async create(attachment: Attachment): Promise<void> {
    console.log(attachment)
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prismService.attachment.create({
      data,
    })
  }
}
