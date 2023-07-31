import { registerDecorator, ValidationOptions } from 'class-validator';

import { ObjectId } from 'bson';
import { isString } from 'lodash';

export const validateObjectIdType = (value: unknown): value is ObjectId => isString(value) && ObjectId.isValid(value);

export function IsObjectId(property?: string, validationOptions?: ValidationOptions) {
  return (object: NonNullable<unknown>, propertyName: string) =>
    registerDecorator({
      propertyName,
      options: {
        message: `${propertyName} must be a valid ObjectId`,
        ...validationOptions,
      },
      constraints: [property],
      target: object.constructor,
      validator: {
        validate: validateObjectIdType,
      },
      name: 'isBsonId',
    });
}
