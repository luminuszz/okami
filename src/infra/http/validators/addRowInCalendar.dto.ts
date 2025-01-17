import { DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row'
import { IsObjectId } from '@infra/utils/IsObjectId'
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class AddRowInCalendarDto {
  @IsObjectId()
  @ApiProperty()
  workId: string

  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'number' })
  dayOfWeek: DaysOfWeek
}
