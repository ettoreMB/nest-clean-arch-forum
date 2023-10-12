import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenertor'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { HashComparer } from '@/domain/forum/application/cryptography/hashComparer'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
