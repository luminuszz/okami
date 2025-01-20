import { SafeParseReturnType, ZodSchema, z } from 'zod'

export interface zodValidator<InputType, ReturnType> {
  new (): ReturnType
  isZodDto: boolean
  create(data: unknown): SafeParseReturnType<InputType, ReturnType>
}

export function createZodValidator<SchemaType extends ZodSchema>(schema: SchemaType) {
  type InputType = (typeof schema)['_input']
  type ZodType = z.infer<typeof schema>

  class InferredZodDtoClass {
    public static schema = schema
    public static isZodDto = true

    public static create(data: unknown) {
      return this.schema.safeParse(data)
    }
  }

  return InferredZodDtoClass as zodValidator<InputType, ZodType>
}

export function isZodValidator(metadata: unknown): metadata is zodValidator<unknown, unknown> {
  return (metadata as zodValidator<unknown, unknown>).isZodDto
}
