import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Slug } from './values-objects/slug';

export interface TagProps {
  name: string;
  slug: Slug;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Tag extends Entity<TagProps> {
  private constructor(props: TagProps, id?: UniqueEntityID) {
    super(props, id);
    this.props.createdAt = props.createdAt ?? new Date();
  }

  static create(props: TagProps, id?: UniqueEntityID) {
    return new Tag(props, id);
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private commit() {
    this.props.updatedAt = new Date();
  }

  set name(name: string) {
    this.props.name = name;
    this.commit();
  }

  set slug(value: string) {
    this.props.slug = new Slug(value);

    this.commit();
  }
}
