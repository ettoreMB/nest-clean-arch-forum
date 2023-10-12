import { ValueObject } from '@/core/entities/value-object'

interface QuestionWithAuthorProps {
  commentId: string
  content: string
  authorId: string
  author: string
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionWithAuthor extends ValueObject<QuestionWithAuthorProps> {
  get commentId() {
    return this.commentId
  }

  get content() {
    return this.content
  }

  get authorId() {
    return this.authorId
  }

  get author() {
    return this.author
  }

  get createdAt() {
    return this.createdAt
  }

  get updatedAt() {
    return this.createdAt
  }

  static create(props: QuestionWithAuthorProps) {
    return new QuestionWithAuthor(props)
  }
}
