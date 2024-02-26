import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserTokenDto } from './dto/user-token.dto';
import { CheckUserSubscriptionStatus } from '@domain/auth/application/useCases/check-user-subscription-status';

@Injectable()
export class SubscriberGuard implements CanActivate {
  constructor(private readonly checkUserSubscriptionStatus: CheckUserSubscriptionStatus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request['user'] as UserTokenDto;

    const results = await this.checkUserSubscriptionStatus.execute({ userId: user.id });

    if (results.isLeft()) {
      throw new UnauthorizedException(results.value);
    }

    const { isChecked } = results.value;

    if (!isChecked) {
      throw new UnauthorizedException('User is not subscribed');
    }

    return isChecked;
  }
}
