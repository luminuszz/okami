import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { validateObjectIdType } from '@infra/utils/IsObjectId';
import { ObjectId } from 'bson';

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): ObjectId {
    const isParam = metadata.type === 'param';

    if (!isParam) return value as ObjectId;

    const isValidObjectId = validateObjectIdType(value);

    if (!isValidObjectId) {
      throw new BadRequestException(`${metadata.data} must be a valid ObjectId`);
    }

    return value;
  }
}
