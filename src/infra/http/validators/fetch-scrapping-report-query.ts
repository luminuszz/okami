import { RefreshStatus } from '@domain/work/enterprise/entities/work';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class FetchScrappingReportQuery {
  @IsNotEmpty()
  @ApiProperty({ type: Number, minimum: 0 })
  @Min(0)
  page: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional({ enum: RefreshStatus, enumName: 'RefreshStatus' })
  filter?: RefreshStatus;
}
