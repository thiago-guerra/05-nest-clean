import { Injectable } from '@nestjs/common'
import { HashGenerate } from '../cryptography/hash-generate'
import { StudentsRepository } from '../repositories/students-repository'
import { Student } from '../../enterprise/entities/student'
import { Either, left, right } from '@/core/either'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface IRegisterStudentUseCases {
  name: string
  email: string
  password: string
}

type IRegisterStudentUseCasesResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>
@Injectable()
export class RegisterStudentUseCases {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerate: HashGenerate,
  ) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterStudentUseCases): Promise<IRegisterStudentUseCasesResponse> {
    const userWithSameEmail = await this.studentRepository.findById(email)

    if (userWithSameEmail) return left(new StudentAlreadyExistsError(email))

    const passwordHash = await this.hashGenerate.hash(password)

    const student = Student.create({
      name,
      email,
      password: passwordHash,
    })

    await this.studentRepository.create(student)

    return right({ student })
  }
}
