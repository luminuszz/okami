import { EnvService } from '@app/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { UserTokenDto } from './dto/user-token.dto'

@Injectable()
export class TokenService {
  constructor(
    private readonly envService: EnvService,
    private readonly jwtService: JwtService,
  ) {}

  async generateUserToken(payload: UserTokenDto, options?: JwtSignOptions): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.envService.get('JWT_SECRET'),
      ...options,
    })
  }
}
