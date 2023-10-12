import { HashComparer } from '@/domain/forum/application/cryptography/hashComparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenertor'

import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
