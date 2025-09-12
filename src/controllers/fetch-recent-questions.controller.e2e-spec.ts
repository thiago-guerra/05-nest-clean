import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Fetch Recent Questions Controller e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'x4t5M@example.com',
        password: await hash('123456', 8),
      },
    })

    const token = jwt.sign({
      sub: user.id,
    })

    await prisma.question.createMany({
      data: [
        {
          title: 'New question 1',
          content: 'Question content 1',
          authorId: user.id,
          slug: 'new-question-1',
        },
        {
          title: 'New question 2',
          content: 'Question content 2',
          authorId: user.id,
          slug: 'new-question-2',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        page: 1,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toEqual([
      expect.objectContaining({ title: 'New question 1' }),
      expect.objectContaining({ title: 'New question 2' }),
    ])
  })
})
