export abstract class QueueProvider {
  abstract publish<Payload = any>(name: string, payload: Payload): Promise<void> | void;
}
