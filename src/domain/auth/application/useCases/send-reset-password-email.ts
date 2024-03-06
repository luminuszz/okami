import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '../errors/UserNotFound';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { MailProvider } from '../contracts/mail-provider';
import { randomUUID } from 'crypto';
import { User } from '@domain/auth/enterprise/entities/User';

interface SendResetPasswordEmailRequest {
  email: string;
}

type SendResetPasswordEmailResponse = Either<UserNotFound, { user: User }>;

@Injectable()
export class SendResetPasswordEmail
  implements UseCaseImplementation<SendResetPasswordEmailRequest, SendResetPasswordEmailResponse>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailProvider: MailProvider,
  ) {}

  async execute({ email }: SendResetPasswordEmailRequest): Promise<SendResetPasswordEmailResponse> {
    const existsUser = await this.userRepository.findByEmail(email);

    if (!existsUser) return left(new UserNotFound());

    const resetPasswordCode = randomUUID();

    existsUser.resetPasswordCode = resetPasswordCode;

    await this.userRepository.save(existsUser);

    await this.emailProvider.sendResetPasswordEmail({
      email: existsUser.email,
      resetPasswordCode,
    });

    return right({ user: existsUser });
  }
}
