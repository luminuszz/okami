import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkModule } from '../crqs/work/work.module';
import { WorkController } from './controllers/work.controller';
import { AuthModule } from '@infra/crqs/auth/auth.module';
import { AuthController } from '@infra/http/controllers/auth.controller';

@Module({
  imports: [CqrsModule, WorkModule, AuthModule],
  controllers: [WorkController, AuthController],
})
export class HttpModule {}
