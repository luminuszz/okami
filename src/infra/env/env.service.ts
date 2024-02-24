import { Injectable } from '@nestjs/common';
import { EnvSecrets } from './parse-env';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvSecrets>) {}

  public get<EnvKey extends keyof EnvSecrets>(envKey: EnvKey): EnvSecrets[EnvKey] {
    return this.configService.get(envKey, { infer: true });
  }
}
