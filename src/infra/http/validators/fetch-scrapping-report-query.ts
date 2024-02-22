import { RefreshStatus } from '@domain/work/enterprise/entities/work';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FetchScrappingReportQuery {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  page: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional({ enum: RefreshStatus, enumName: 'RefreshStatus' })
  filter?: RefreshStatus;
}
