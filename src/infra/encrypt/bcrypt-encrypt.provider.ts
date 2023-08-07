import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptEncryptProvider implements HashProvider {
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
