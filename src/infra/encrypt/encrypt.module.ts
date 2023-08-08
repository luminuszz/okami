import { Module } from '@nestjs/common';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { BcryptEncryptProvider } from '@infra/encrypt/bcrypt-encrypt.provider';

@Module({
  providers: [
    {
      provide: HashProvider,
      useClass: BcryptEncryptProvider,
    },
  ],

  exports: [HashProvider],
})
export class EncryptModule {}
