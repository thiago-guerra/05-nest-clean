import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerate } from '@/domain/forum/application/cryptography/hash-generate'
import { hash, compare } from 'bcryptjs'
export class BcryptHasher implements HashGenerate, HashCompare {
  private HASH_SALT_LENGTH = 8
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(hash, plain)
  }

  async hash(password: string): Promise<string> {
    return hash(password, this.HASH_SALT_LENGTH)
  }
}
