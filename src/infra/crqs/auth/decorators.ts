import { createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) throw new Error('User not found');

  return request.user;
});

export const WithAuth = () => UseGuards(AuthGuard);
