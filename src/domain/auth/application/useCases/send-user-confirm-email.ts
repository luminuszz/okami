import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { MailProvider } from '@domain/auth/application/contracts/mail-provider';
import { UserEmailAlreadyConfirmed } from '@domain/auth/application/errors/UserEmailAlreadyConfirmed';
import { User } from '@domain/auth/enterprise/entities/User';

interface SendUserConfirmEmailRequest {
  userId: string;
}

type SendUserConfirmEmailResponse = Either<UserNotFound | UserEmailAlreadyConfirmed, { user: User }>;

@Injectable()
export class SendUserConfirmEmail
  implements UseCaseImplementation<SendUserConfirmEmailRequest, SendUserConfirmEmailResponse>
{
  constructor(
    private userRepository: UserRepository,
    private mail: MailProvider,
  ) {}

  async execute({ userId }: SendUserConfirmEmailRequest): Promise<SendUserConfirmEmailResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFound());
    }

    if (user.emailIsValidated) {
      return left(new UserEmailAlreadyConfirmed());
    }

    user.confirmEmailCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.userRepository.save(user);

    await this.mail.sendConfirmEmail({
      email: user.email,
      confirmEmailCode: user.confirmEmailCode,
    });

    return right({
      user,
    });
  }
}
