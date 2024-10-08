import { ObjectId } from 'bson';

export class UniqueEntityID {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id ? id : new ObjectId().toString('hex');
  }

  get value(): string {
    return this._value;
  }

  toValue() {
    return this._value;
  }

  public equals(id?: UniqueEntityID): boolean {
    return this._value === id?.value;
  }

  public toEntity() {
    return this;
  }
}
