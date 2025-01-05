import { registerDecorator, ValidationOptions } from 'class-validator';

import { DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row';

export const validateDayOfWeek = (value: unknown): value is DaysOfWeek => Number(value) >= 0 && Number(value) <= 6;

export function IsDayOfWeek(property?: string, validationOptions?: ValidationOptions) {
  return (object: NonNullable<unknown>, propertyName: string) =>
    registerDecorator({
      propertyName,
      options: {
        message: `${propertyName} must be a valid day of week [0-6]`,
        ...validationOptions,
      },
      constraints: [property],
      target: object.constructor,
      validator: {
        validate: validateDayOfWeek,
      },
      name: 'isDayOfWeek',
    });
}
