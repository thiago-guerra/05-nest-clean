import { RegisterStudentUseCases } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repositories'
import { FakerHasher } from 'test/cryptography/faker-hasher'

let sut: RegisterStudentUseCases
let repository: InMemoryStudentsRepository
let fakerHash: FakerHasher

describe('Register Student', async () => {
  beforeEach(() => {
    repository = new InMemoryStudentsRepository()
    fakerHash = new FakerHasher()
    sut = new RegisterStudentUseCases(repository, fakerHash)
  })

  it('should be able to register student', async () => {
    const result = await sut.execute({
      name: 'student 1',
      email: 'student@a.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: repository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'student 1',
      email: 'student@a.com',
      password: '123456',
    })

    const passwordHash = await fakerHash.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(repository.items[0].password).toEqual(passwordHash)
  })
})
