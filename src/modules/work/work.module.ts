import { DatabaseModule } from '@app/infra/database/database.module';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { MarkWorkReadUseCase } from '@domain/work/application/usecases/mark-work-read';
import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { UpdateWorkChapterUseCase } from '@domain/work/application/usecases/update-work-chapter';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateWorkHandler } from './commands/create-work.command';
import { WorkController } from './work.controller';

const CommandHandlers = [CreateWorkHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [WorkController],
  providers: [
    ...CommandHandlers,
    CreateWorkUseCase,
    UpdateWorkChapterUseCase,
    MarkWorkReadUseCase,
    MarkWorkUnreadUseCase,
  ],
})
export class WorkModule {}
