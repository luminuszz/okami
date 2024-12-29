import { EnvService } from '@app/infra/env/env.service';
import { MailModule } from '@app/infra/mail/mail.module';
import { AuthenticateUserUseCase } from '@domain/auth/application/useCases/authenticate-user';
import { CheckUserSubscriptionStatus } from '@domain/auth/application/useCases/check-user-subscription-status';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { CreateRefreshTokenUseCase } from '@domain/auth/application/useCases/create-refresh-token';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { FetchUserAnalytics } from '@domain/auth/application/useCases/fetch-user-analytics';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { GetUserTrialQuote } from '@domain/auth/application/useCases/get-user-trial-quote';
import { ResetUserPassword } from '@domain/auth/application/useCases/reset-user-password';
import { ResetUserPasswordByAdminCodeKey } from '@domain/auth/application/useCases/reset-user-password-by-admin-code-key';
import { SendConfirmEmail } from '@domain/auth/application/useCases/send-confirm-email';
import { SendResetPasswordEmail } from '@domain/auth/application/useCases/send-reset-password-email';
import { SetAdminHashCodeKeyUseCase } from '@domain/auth/application/useCases/set-admin-hash-code-key';
import { UpdateNotionDatabaseId } from '@domain/auth/application/useCases/update-notion-database-id';
import { UpdateUser } from '@domain/auth/application/useCases/update-user';
import { UploadUserAvatarImage } from '@domain/auth/application/useCases/upload-user-avatar-image';
import { ValidateEmailCode } from '@domain/auth/application/useCases/validate-email-code';
import { ValidateRefreshToken } from '@domain/auth/application/useCases/validate-refresh-token';
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';
import { CreateAccessTokenCommandHandler } from '@infra/crqs/auth/commands/create-access-token.command';
import { CreateAdminHashCodeCommandHandler } from '@infra/crqs/auth/commands/create-admin-hash-code.command';
import { CreateUserCommandHandler } from '@infra/crqs/auth/commands/create-user.command';
import { LoginCommandHandler } from '@infra/crqs/auth/commands/login.command';
import { ResetPasswordCommandHandler } from '@infra/crqs/auth/commands/reset-password.command';
import { UploadUserImageUrlCommandHandler } from '@infra/crqs/auth/commands/upload-user-image-url.command';
import { ValidateEmailCodeCommandHandler } from '@infra/crqs/auth/commands/validate-email-code.command';
import { FindUserByIdQueryHandler } from '@infra/crqs/auth/queries/find-user-by-id.query';
import { EncryptModule } from '@infra/encrypt/encrypt.module';
import { StorageModule } from '@infra/storage/storage.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MakeLoginWithRefreshTokenCommandHandler } from './commands/make-login-with-refresh-token';
import { RefreshTokenCommandHandler } from './commands/refresh-token.command';
import { ResetUserPasswordCommandHandler } from './commands/reset-user-passsword.command';
import { SendConfirmEmailCommandHandler } from './commands/send-confirm-email.command';
import { SendResetPasswordEmailCommandHandler } from './commands/send-reset-password-emai.command';
import { UpdateNotionDatabaseIdCommandHandler } from './commands/update-notion-database-id.command';
import { UpdateUserCommandHandler } from './commands/update-user.command';
import { FetchUserAnalyticsQueryHandler } from './queries/fetch-user-analytics';
import { RoleGuard } from './role.guard';
import { SubscriberGuard } from './subscriber.guard';
import { TokenService } from './token.service';
import { InvalidateRefreshTokenCommandHandler } from '@infra/crqs/auth/commands/invalidate-refresh-token-command';
import { InvalidateRefreshToken } from '@domain/auth/application/useCases/invalidate-refresh-token';

const Commands = [
  LoginCommandHandler,
  UploadUserImageUrlCommandHandler,
  CreateUserCommandHandler,
  CreateAccessTokenCommandHandler,
  CreateAdminHashCodeCommandHandler,
  ResetPasswordCommandHandler,
  UpdateNotionDatabaseIdCommandHandler,
  SendResetPasswordEmailCommandHandler,
  ResetUserPasswordCommandHandler,
  UpdateUserCommandHandler,
  SendConfirmEmailCommandHandler,
  ValidateEmailCodeCommandHandler,
  CreateRefreshTokenUseCase,
  RefreshTokenCommandHandler,
  MakeLoginWithRefreshTokenCommandHandler,
  InvalidateRefreshTokenCommandHandler,
];

const Queries = [FindUserByIdQueryHandler, FetchUserAnalyticsQueryHandler];

@Module({
  imports: [
    MailModule,
    CqrsModule,
    StorageModule,
    EncryptModule,
    JwtModule.registerAsync({
      useFactory: (env: EnvService) => ({
        global: true,
        secret: env.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    TokenService,
    InvalidateRefreshToken,
    ValidateRefreshToken,
    SendConfirmEmail,
    SendResetPasswordEmail,
    CreateApiAccessTokenUseCase,
    UploadWorkImageUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    AuthGuard,
    JwtService,
    SubscriberGuard,
    UploadUserAvatarImage,
    FindUserByIdUseCase,
    VerifyApiAccessTokenUseCase,
    SetAdminHashCodeKeyUseCase,
    ResetUserPasswordByAdminCodeKey,
    UpdateNotionDatabaseId,
    CheckUserSubscriptionStatus,
    FetchUserAnalytics,
    GetUserTrialQuote,
    ResetUserPassword,
    ValidateEmailCode,
    CreateRefreshTokenUseCase,
    UpdateUser,
    ...Commands,
    ...Queries,
    RoleGuard,
  ],
  exports: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    AuthGuard,
    JwtService,
    UploadWorkImageUseCase,
    FindUserByIdUseCase,
    VerifyApiAccessTokenUseCase,
    SetAdminHashCodeKeyUseCase,
    ResetUserPasswordByAdminCodeKey,
    UpdateNotionDatabaseId,
    CheckUserSubscriptionStatus,
    SubscriberGuard,
    GetUserTrialQuote,
    RoleGuard,
  ],
})
export class AuthModule {}
