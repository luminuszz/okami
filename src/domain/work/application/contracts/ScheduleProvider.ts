export abstract class ScheduleProvider {
  abstract createTask(taskName: string, time: string, triggerFunction: () => void): void;
}
