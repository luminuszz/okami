import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { UserRole } from '@domain/auth/enterprise/entities/User';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTokenDto } from './dto/user-token.dto';

const ROLE_DECORATOR_METADATA_KEY = 'roles';

type UserRoleKey = keyof typeof UserRole;

type RoleParams = UserRoleKey | UserRoleKey[];

export const ProtectFor = (role: RoleParams) => SetMetadata(ROLE_DECORATOR_METADATA_KEY, role);

const existsRole = (role: unknown): role is RoleParams => {
  if (Array.isArray(role)) {
    return !!role.length;
  }

  return !!role;
};

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly findUserById: FindUserByIdUseCase,
    private readonly reflect: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const availableRoles = this.reflect.getAllAndOverride<RoleParams>(ROLE_DECORATOR_METADATA_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    const needToValidateRole = existsRole(availableRoles);

    if (!needToValidateRole) {
      return true;
    }

    const userToken = request['user'] as UserTokenDto;

    const response = await this.findUserById.execute({ id: userToken.id });

    if (response.isLeft()) {
      throw response.value;
    }

    const { user } = response.value;

    const canAccess = Array.isArray(availableRoles) ? availableRoles.includes(user.role) : availableRoles === user.role;

    return canAccess;
  }
}
