import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerate } from '@/domain/forum/application/cryptography/hash-generate'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerate,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashCompare, HashGenerate],
})
export class CryptographyModule {}
