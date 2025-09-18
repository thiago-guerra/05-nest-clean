import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repositories'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { FakerEncrypter } from 'test/cryptography/faker-encrypter'
import { AuthenticateStudentUseCases } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let sut: AuthenticateStudentUseCases
let repository: InMemoryStudentsRepository
let fakerHash: FakerHasher
let fakerEncrypt: FakerEncrypter

describe('Authenticate Student', async () => {
  beforeEach(() => {
    repository = new InMemoryStudentsRepository()
    fakerHash = new FakerHasher()
    fakerEncrypt = new FakerEncrypter()
    sut = new AuthenticateStudentUseCases(repository, fakerHash, fakerEncrypt)
  })

  it('should be able to Authenticate student', async () => {
    const student = makeStudent({
      name: 'student 1',
      email: 'student@a.com',
      password: await fakerHash.hash('123456'),
    })

    await repository.create(student)

    const result = await sut.execute({
      email: 'student@a.com',
      password: '123456',
    })

    console.log('result', result)
    expect(result.isRight()).toBe(true)
    // expect(result.value).toEqual({
    //   accessToken: expect.any(String),
    // })
  })
})
