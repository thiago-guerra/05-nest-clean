import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { User as PrismaStudent, Prisma } from '@prisma/client'
export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(Student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: Student.id.toString(),
      email: Student.email,
      name: Student.name,
      password: Student.password,
    }
  }
}
