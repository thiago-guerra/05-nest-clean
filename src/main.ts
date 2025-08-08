import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Env } from 'emv'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port || 3333)
}

bootstrap()
