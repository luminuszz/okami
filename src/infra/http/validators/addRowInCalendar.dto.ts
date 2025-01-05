import { IsDayOfWeek } from '@app/infra/utils/isDayOfWeek';
import { DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row';
import { IsObjectId } from '@infra/utils/IsObjectId';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddRowInCalendarDto {
  @IsObjectId()
  @ApiProperty()
  workId: string;

  @IsInt()
  @IsDayOfWeek()
  @ApiProperty({ type: 'number' })
  dayOfWeek: DaysOfWeek;
}
