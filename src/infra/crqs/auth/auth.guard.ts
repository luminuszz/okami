import { EnvService } from '@app/infra/env/env.service'
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case'
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'

const IS_PUBLIC_METADATA_KEY = 'isPublic'

export const WithAuth = () => UseGuards(AuthGuard)

export const IsPublic = () => SetMetadata(IS_PUBLIC_METADATA_KEY, true)

export const OKAMI_COOKIE_NAME = 'okami-web-token'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
    private readonly verifyAccessToken: VerifyApiAccessTokenUseCase,
    private readonly reflector: Reflector,
  ) {}

  private readonly accessTokenHeaderKey = 'accesstoken'

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_METADATA_KEY, [
      context.getClass(),
      context.getHandler(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const jwtToken = this.extractTokenFormRequest(request)

    try {
      if (!jwtToken) {
        const accessToken = this.extractAccessTokenFromHeader(request)

        if (accessToken) {
          return await this.validateAccessToken(accessToken, request)
        }
      }

      const decodePayload = await this.jwtService.verifyAsync<UserTokenDto>(jwtToken, {
        secret: this.env.get('JWT_SECRET'),
      })

      request['user'] = decodePayload

      return !!decodePayload
    } catch {
      throw new UnauthorizedException('invalid token')
    }
  }

  private extractTokenFormRequest(request: FastifyRequest): string | undefined {
    let token: string

    if (request.cookies[OKAMI_COOKIE_NAME]) {
      token = request.cookies[OKAMI_COOKIE_NAME]
    }

    if (request.headers['authorization']) {
      token = request.headers.authorization.split(' ')[1]
    }

    return token
  }

  private extractAccessTokenFromHeader(request: FastifyRequest): string | undefined {
    return request.headers[this.accessTokenHeaderKey] as string
  }

  private async validateAccessToken(token: string, request: { user: any }): Promise<boolean> {
    const results = await this.verifyAccessToken.execute({ token })

    if (results.isLeft()) {
      throw results.value
    }

    const { isValid, owner } = results.value

    if (isValid) {
      request['user'] = {
        email: owner.email,
        name: owner.name,
        notionDatabaseId: owner.notionDatabaseId,
        id: owner.id,
      } satisfies UserTokenDto
    }

    return isValid
  }
}
