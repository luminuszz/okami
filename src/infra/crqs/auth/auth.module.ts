import { EnvService } from '@app/infra/env/env.service';
import { AuthenticateUserUseCase } from '@domain/auth/application/useCases/authenticate-user';
import { CheckUserSubscriptionStatus } from '@domain/auth/application/useCases/check-user-subscription-status';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { ResetUserPasswordByAdminCodeKey } from '@domain/auth/application/useCases/reset-user-password-by-admin-code-key';
import { SetAdminHashCodeKeyUseCase } from '@domain/auth/application/useCases/set-admin-hash-code-key';
import { UpdateNotionDatabaseId } from '@domain/auth/application/useCases/update-notion-database-id';
import { UploadUserAvatarImage } from '@domain/auth/application/useCases/upload-user-avatar-image';
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';
import { CreateAccessTokenCommandHandler } from '@infra/crqs/auth/commands/create-access-token.command';
import { CreateAdminHashCodeCommandHandler } from '@infra/crqs/auth/commands/create-admin-hash-code.command';
import { CreateUserCommandHandler } from '@infra/crqs/auth/commands/create-user.command';
import { LoginCommandHandler } from '@infra/crqs/auth/commands/login.command';
import { ResetPasswordCommandHandler } from '@infra/crqs/auth/commands/reset-password.command';
import { UploadUserImageUrlCommandHandler } from '@infra/crqs/auth/commands/upload-user-image-url.command';
import { FindUserByIdQueryHandler } from '@infra/crqs/auth/queries/find-user-by-id.query';
import { EncryptModule } from '@infra/encrypt/encrypt.module';
import { StorageModule } from '@infra/storage/storage.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UpdateNotionDatabaseIdCommandHandler } from './commands/update-notion-database-id.command';
import { SubscriberGuard } from './subscriber.guard';
import { FetchUserAnalytics } from '@domain/auth/application/useCases/fetch-user-analytics';
import { FetchUserAnalyticsQueryHandler } from './queries/fetch-user-analytics';

const Commands = [
  LoginCommandHandler,
  UploadUserImageUrlCommandHandler,
  CreateUserCommandHandler,
  CreateAccessTokenCommandHandler,
  CreateAdminHashCodeCommandHandler,
  ResetPasswordCommandHandler,
  UpdateNotionDatabaseIdCommandHandler,
];

const Queries = [FindUserByIdQueryHandler, FetchUserAnalyticsQueryHandler];

@Module({
  imports: [
    CqrsModule,
    StorageModule,
    EncryptModule,
    JwtModule.registerAsync({
      useFactory: (env: EnvService) => ({
        global: true,
        secret: env.get('JWT_SECRET'),
        signOptions: { expiresIn: '3d' },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    CreateApiAccessTokenUseCase,
    UploadWorkImageUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    AuthGuard,
    JwtService,
    SubscriberGuard,
    ...Commands,
    ...Queries,
    UploadUserAvatarImage,
    FindUserByIdUseCase,
    VerifyApiAccessTokenUseCase,
    SetAdminHashCodeKeyUseCase,
    ResetUserPasswordByAdminCodeKey,
    UpdateNotionDatabaseId,
    CheckUserSubscriptionStatus,
    FetchUserAnalytics,
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
  ],
})
export class AuthModule {}
