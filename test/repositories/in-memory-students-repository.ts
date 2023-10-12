import { StudentRepository } from '@/domain/forum/application/repositories/studentes-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentRepository {
  public items: Student[] = []
  constructor() {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((items) => items.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
