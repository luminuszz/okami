import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly verifyAccessToken: VerifyApiAccessTokenUseCase,
  ) {}

  private readonly accessTokenHeaderKey = 'accesstoken';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const jwtToken = this.extractTokenFromHeader(request);

    try {
      if (!jwtToken) {
        const accessToken = this.extractAccessTokenFromHeader(request);

        if (accessToken) {
          return await this.validateAccessToken(accessToken);
        }
      }

      const decodePayload = await this.jwtService.verifyAsync<UserTokenDto>(jwtToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      request['user'] = decodePayload;

      return !!decodePayload;
    } catch (e) {
      console.log(e);

      throw new UnauthorizedException('invalid token');
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const token = request.cookies['@okami-web:token'];

    return token;
  }

  private extractAccessTokenFromHeader(request: FastifyRequest): string | undefined {
    return request.headers[this.accessTokenHeaderKey] as string;
  }

  private async validateAccessToken(token: string): Promise<boolean> {
    const results = await this.verifyAccessToken.execute({ token });

    if (results.isLeft()) {
      throw results.value;
    }

    return results.value.isValid;
  }
}
