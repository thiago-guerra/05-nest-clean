import { HttpCode, Controller, Post, UseGuards, Body } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const zodValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: CreateQuestionBodySchema,
  ) {
    console.log(body)
    const { title, content } = body
    const userId = user.sub

    const slug = this.stringToSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        content,
        authorId: userId,
        slug,
      },
    })
  }

  private stringToSlug(text: string): string {
    return text
      .toLowerCase() // tudo minúsculo
      .normalize('NFD') // separa caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
      .trim() // remove espaços extras no início e fim
      .replace(/\s+/g, '-') // substitui espaços por hífens
      .replace(/-+/g, '-') // evita múltiplos hífens consecutivos
  }
}
