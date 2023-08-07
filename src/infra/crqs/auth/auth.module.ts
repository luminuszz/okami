import { Module } from '@nestjs/common';
import { LoginCommandHandler } from '@infra/crqs/auth/commands/login.command';
import { EncryptModule } from '@infra/encrypt/encrypt.module';
import { AuthenticateUserUseCase } from '@domain/auth/application/useCases/authenticate-user';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from '@infra/crqs/auth/commands/create-user.command';
import { DatabaseModule } from '@infra/database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';

@Module({
  imports: [
    CqrsModule,
    EncryptModule,
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '3d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    LoginCommandHandler,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    CreateUserCommandHandler,
    AuthGuard,
    JwtService,
  ],
  exports: [AuthenticateUserUseCase, CreateUserUseCase, AuthGuard, JwtService],
})
export class AuthModule {}
