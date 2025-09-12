import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { Either, left, right } from '@/core/either'
import { HashCompare } from '../cryptography/hash-compare'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface IAuthenticateStudentUseCases {
  email: string
  password: string
}

type IAuthenticateStudentUseCasesResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>
@Injectable()
export class AuthenticateStudentUseCases {
  constructor(
    private studentRepository: StudentsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateStudentUseCases): Promise<IAuthenticateStudentUseCasesResponse> {
    const student = await this.studentRepository.findById(email)

    if (!student) return left(new WrongCredentialsError())

    const passwordCorrect = await this.hashCompare.compare(
      password,
      student.password,
    )
    if (!passwordCorrect) return left(new WrongCredentialsError())

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
