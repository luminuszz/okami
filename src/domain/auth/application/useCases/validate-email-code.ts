import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';

interface ValidateEmailCodeRequest {
  id: string;
  code: string;
}

type ValidateEmailCodeResponse = Either<UserNotFound, { user: User }>;

@Injectable()
export class ValidateEmailCode implements UseCaseImplementation<ValidateEmailCodeRequest, ValidateEmailCodeResponse> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id, code }: ValidateEmailCodeRequest): Promise<ValidateEmailCodeResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return left(new UserNotFound());
    }

    const codeIsInvalid = user.emailCodeIsExpired || user.emailCode !== code;

    if (codeIsInvalid) {
      return left(new InvalidCodeKey());
    }

    user.validateEmail();

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
