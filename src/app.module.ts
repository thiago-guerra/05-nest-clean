import { Global, Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from 'emv'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionsController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionsController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
