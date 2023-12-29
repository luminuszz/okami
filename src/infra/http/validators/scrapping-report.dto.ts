import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from '@infra/utils/IsObjectId';

export class ScrappingReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['success', 'error'])
  status: 'success' | 'error';

  @ApiProperty()
  @IsObjectId()
  workId: string;
}
