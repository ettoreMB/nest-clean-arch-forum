import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/commnet-with-author'
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toPrisma() {}

  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      author: raw.author.name,
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      commentId: new UniqueEntityID(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
