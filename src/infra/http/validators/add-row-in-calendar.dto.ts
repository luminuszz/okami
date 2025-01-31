import { DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row'
import { createZodValidator } from '@infra/http/validators/zod/create-validator'
import { ApiProperty } from '@nestjs/swagger'

import { z } from 'zod'

const schema = z.object({
  workId: z.string(),
  dayOfWeek: z.number(),
})

export class AddRowInCalendarDto extends createZodValidator(schema) {
  @ApiProperty()
  workId: string

  @ApiProperty({ type: 'number' })
  dayOfWeek: DaysOfWeek
}
