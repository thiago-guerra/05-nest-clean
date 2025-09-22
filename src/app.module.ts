import { Global, Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from 'emv'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionsController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from './database/database.module'
import { CreateQuestionUseCases } from './domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCases } from './domain/forum/application/use-cases/fetch-recent-questions'
import { AuthenticateStudentUseCases } from './domain/forum/application/use-cases/authenticate-student'
import { CryptographyModule } from './cryptography/cryptography.module'
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
    DatabaseModule,
    CryptographyModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionsController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCases,
    FetchRecentQuestionsUseCases,
    AuthenticateStudentUseCases,
  ],
})
export class AppModule {}
