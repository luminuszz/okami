import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { z } from 'zod'
import { createZodValidator } from './zod/create-validator'

export class MakeSessionDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: 'string', format: 'email' })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', format: 'password' })
  password: string
}

export class MakeSessionValidator extends createZodValidator(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
) {
  @ApiProperty({ type: 'string', format: 'email' })
  email: string

  @ApiProperty({ type: 'string' })
  password: string
}
