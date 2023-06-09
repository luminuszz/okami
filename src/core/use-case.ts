export abstract class UseCaseImplementation<Input = void, Output = void> {
  abstract execute(input: Input): Promise<Output>;
}
