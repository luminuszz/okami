import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleProvider } from '@domain/work/application/contracts/ScheduleProvider';
import { NestScheduleProvider } from '@infra/tasks/nest-schedule.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: ScheduleProvider,
      useClass: NestScheduleProvider,
    },
  ],

  exports: [ScheduleProvider],
})
export class TaskModule {}
