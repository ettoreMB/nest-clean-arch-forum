import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../repositories/studentes-repository'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from '@/core/errors/errors/student-already-exists-error'
import { HashGenerator } from '../cryptography/hashGenertor'
import { Injectable } from '@nestjs/common'

export interface RegisterStudentUseCaseInput {
  name: string
  email: string
  password: string
}

export type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseInput): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentRepository.create(student)

    return right({ student })
  }
}
