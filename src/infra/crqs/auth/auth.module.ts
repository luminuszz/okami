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
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { UploadUserImageUrlCommandHandler } from '@infra/crqs/auth/commands/upload-user-image-url.command';
import { StorageModule } from '@infra/storage/storage.module';
import { UploadUserAvatarImage } from '@domain/auth/application/useCases/upload-user-avatar-image';
import { FindUserByIdQueryHandler } from '@infra/crqs/auth/queries/find-user-by-id.query';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { CreateAccessTokenCommandHandler } from '@infra/crqs/auth/commands/create-access-token.command';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case';

const Commands = [
  LoginCommandHandler,
  UploadUserImageUrlCommandHandler,
  CreateUserCommandHandler,
  CreateAccessTokenCommandHandler,
];
const Queries = [FindUserByIdQueryHandler];

@Module({
  imports: [
    CqrsModule,
    StorageModule,
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
    CreateApiAccessTokenUseCase,
    UploadWorkImageUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    AuthGuard,
    JwtService,
    ...Commands,
    ...Queries,
    UploadUserAvatarImage,
    FindUserByIdUseCase,
    VerifyApiAccessTokenUseCase,
  ],
  exports: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    AuthGuard,
    JwtService,
    UploadWorkImageUseCase,
    FindUserByIdUseCase,
    VerifyApiAccessTokenUseCase,
  ],
})
export class AuthModule {}
