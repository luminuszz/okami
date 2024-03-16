import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserTokenDto } from '../crqs/auth/dto/user-token.dto';

export const User = createParamDecorator((data: keyof UserTokenDto | undefined, ctx: ExecutionContext) =>
  data ? ctx.switchToHttp().getRequest().user[data] : ctx.switchToHttp().getRequest().user,
);
