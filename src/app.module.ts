import { Global, Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from 'emv'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
  ],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
