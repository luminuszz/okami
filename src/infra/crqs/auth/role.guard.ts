import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id'
import { UserRole } from '@domain/auth/enterprise/entities/User'
import { SentryService } from '@infra/logs/sentry/sentry.service'
import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserTokenDto } from './dto/user-token.dto'

const ROLE_DECORATOR_METADATA_KEY = 'roles'

type UserRoleKey = keyof typeof UserRole

type RoleParams = UserRoleKey | UserRoleKey[]

export const ProtectFor = (role: RoleParams) => SetMetadata(ROLE_DECORATOR_METADATA_KEY, role)

const existsRole = (role: unknown): role is RoleParams => {
  if (Array.isArray(role)) {
    return !!role.length
  }
  return !!role
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly findUserById: FindUserByIdUseCase,
    private readonly reflect: Reflector,
    private readonly sentryService: SentryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()

      const availableRoles = this.reflect.getAllAndOverride<RoleParams>(ROLE_DECORATOR_METADATA_KEY, [
        context.getClass(),
        context.getHandler(),
      ])

      const needToValidateRole = existsRole(availableRoles)

      if (!needToValidateRole) {
        return true
      }

      const userToken = request['user'] as UserTokenDto

      const response = await this.findUserById.execute({ id: userToken.id })

      if (response.isLeft()) {
        throw response.value
      }

      const { user } = response.value

      return Array.isArray(availableRoles) ? availableRoles.includes(user.role) : availableRoles === user.role
    } catch (e) {
      this.sentryService.captureException(e)

      throw new UnauthorizedException("You don't have permission to access this resource.")
    }
  }
}
