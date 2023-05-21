import { UniqueEntityID } from './unique-entity-id';

export interface DomainEvent<Payload extends unknown = unknown> {
  eventName: string;
  payload: Payload;
}

export class Entity<EntityProps> {
  private _id: UniqueEntityID;

  protected props: EntityProps;

  constructor(props: EntityProps, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();

    this.props = props;
  }

  public get id() {
    return this._id.toValue();
  }

  public events: DomainEvent[] = [];
}
