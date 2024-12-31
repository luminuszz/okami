import { IsObjectId } from '@infra/utils/IsObjectId';
import { ApiProperty } from '@nestjs/swagger';
import { DaysOfWeek } from '@domain/calendar/enterprise/entities/calendar-row';
import { IsInt, IsPositive } from 'class-validator';

export class AddRowInCalendarDto {
  @IsObjectId()
  @ApiProperty()
  workId: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    enum: [1, 2, 3, 4, 5, 6],
  })
  dayOfWeek: DaysOfWeek;
}
