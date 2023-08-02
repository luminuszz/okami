import { ScheduleProvider } from '@domain/work/application/contracts/ScheduleProvider';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestScheduleProvider implements ScheduleProvider {
  constructor(private readonly scheduleService: SchedulerRegistry) {}

  createTask(taskName: string, time: string, triggerFunction: () => void): void {
    const job = new CronJob(time, triggerFunction, null, true, 'America/Bahia', null, true);

    const existsThisCron = this.scheduleService.getCronJobs().has(taskName);

    if (!existsThisCron) {
      this.scheduleService.addCronJob(taskName, job);
      job.start();
      return;
    }
  }
}
