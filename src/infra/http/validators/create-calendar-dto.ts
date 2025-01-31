import { createZodValidator } from '@infra/http/validators/zod/create-validator'
import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export class CreateCalendarDto extends createZodValidator(schema) {
  @ApiProperty()
  title: string

  @ApiProperty({ type: 'string', required: false })
  description?: string
}
