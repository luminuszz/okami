import { createZodValidator } from '@infra/http/validators/zod/create-validator'
import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export class CompareSubscriberAuthTokenDto extends createZodValidator(
  z.object({
    userId: z.string(),
    authCode: z.string(),
  }),
) {
  @ApiProperty()
  userId: string

  @ApiProperty()
  authCode: string
}
