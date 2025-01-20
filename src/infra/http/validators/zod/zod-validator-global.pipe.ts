import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isZodValidator } from './create-validator'

@Injectable()
export class ZodValidatorGlobalPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    const hasValidator = isZodValidator(metatype)

    if (!hasValidator) return value

    const results = metatype.create(value)

    if (!results.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: results.error.flatten().fieldErrors,
      })
    }

    return results.data
  }
}
