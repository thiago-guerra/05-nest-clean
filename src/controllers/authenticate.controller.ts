import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCases } from '@/domain/forum/application/use-cases/authenticate-student'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCases,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
