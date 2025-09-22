import { HttpCode, Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentUseCases } from '@/domain/forum/application/use-cases/register-student'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
})

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudentUseCases) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(@Body() body: any) {
    const { email, name, password } = body

    const user = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (user.isLeft()) {
      throw new Error()
    }
  }
}
