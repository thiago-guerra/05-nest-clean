import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerate } from '@/domain/forum/application/cryptography/hash-generate'

export class FakerHasher implements HashGenerate, HashCompare {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === plain.concat('-hashed')
  }
}
