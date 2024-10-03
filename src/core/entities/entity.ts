import { UniqueEntityID } from './unique-entity-id';

export interface DomainEvent<Payload = unknown> {
  eventName: string;
  payload: Payload;
}

export class Entity<EntityProps> {
  private readonly _id: UniqueEntityID;

  protected props: EntityProps;

  constructor(props: EntityProps, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();

    this.props = props;
  }

  public get id() {
    return this._id.toValue();
  }

  public toUniqueEntityID() {
    return this._id;
  }

  public equals(entity?: Entity<EntityProps>): boolean {
    return this._id.equals(entity?._id);
  }

  public events: DomainEvent[] = [];
}
