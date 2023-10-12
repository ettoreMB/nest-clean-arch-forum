import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../repositories/studentes-repository'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hashComparer'
import { Encrypter } from '../cryptography/encrypter'

export interface AuthenticateStudentUseCaseInput {
  email: string
  password: string
}

export type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseInput): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
