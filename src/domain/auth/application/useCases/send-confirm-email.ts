import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MailProvider } from '../contracts/mail-provider';
import { UserNotFound } from '../errors/UserNotFound';
import { UserRepository } from './repositories/user-repository';

interface SendConfirmEmailRequest {
  userId: string;
}

type SendConfirmEmailResponse = Either<UserNotFound, { user: User }>;

@Injectable()
export class SendConfirmEmail implements UseCaseImplementation<SendConfirmEmailRequest, SendConfirmEmailResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailProvider: MailProvider,
  ) {}

  async execute({ userId }: SendConfirmEmailRequest): Promise<SendConfirmEmailResponse> {
    const existsUser = await this.userRepository.findById(userId);

    if (!existsUser) {
      return left(new UserNotFound());
    }

    existsUser.emailValidationCode = randomUUID();

    await this.userRepository.save(existsUser);

    await this.mailProvider.sendConfirmEmail({
      email: existsUser.email,
      confirmEmailCode: existsUser.emailCode,
    });

    return right({
      user: existsUser,
    });
  }
}
