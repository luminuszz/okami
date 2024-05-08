import { EnvService } from '@app/infra/env/env.service';
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

const IS_PUBLIC_METADATA_KEY = 'isPublic';

export const WithAuth = () => UseGuards(AuthGuard);

export const IsPublic = () => SetMetadata(IS_PUBLIC_METADATA_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
    private readonly verifyAccessToken: VerifyApiAccessTokenUseCase,
    private readonly reflector: Reflector,
  ) {}

  private readonly accessTokenHeaderKey = 'accesstoken';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_METADATA_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const jwtToken = this.extractTokenFormRequest(request);

    try {
      if (!jwtToken) {
        const accessToken = this.extractAccessTokenFromHeader(request);

        if (accessToken) {
          return await this.validateAccessToken(accessToken);
        }
      }

      const decodePayload = await this.jwtService.verifyAsync<UserTokenDto>(jwtToken, {
        secret: this.env.get('JWT_SECRET'),
      });

      request['user'] = decodePayload;

      return !!decodePayload;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }

  private extractTokenFormRequest(request: FastifyRequest): string | undefined {
    let token: string;

    if (request.cookies['@okami-web:token']) {
      token = request.cookies['@okami-web:token'];
    }

    if (request.headers['authorization']) {
      const bearerToken = request.headers.authorization.split(' ')[1];

      token = bearerToken;
    }

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
