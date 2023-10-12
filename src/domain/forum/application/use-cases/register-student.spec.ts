import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Stundet', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register  a student', async () => {
    const result = await sut.execute({
      email: 'student@student.com',
      name: 'student',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()

    expect(inMemoryStudentsRepository.items[0].name).toBe('student')
  })

  it('should not be able to register a student with a email  already created', async () => {
    await sut.execute({
      email: 'student@student.com',
      name: 'student',
      password: '123456',
    })

    const result = await sut.execute({
      email: 'student@student.com',
      name: 'student2',
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
