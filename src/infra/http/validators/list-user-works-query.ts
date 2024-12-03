import { Status } from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class ListUserWorksQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: ['unread', 'read', 'finished', 'favorites'],
  })
  status?: Status;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  search?: string;
}

export class ListUserWorkQueryPaged extends ListUserWorksQuery {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  page: number;

  @ApiProperty({
    type: Number,
    enum: [10, 20, 30],
  })
  @IsNumber()
  @IsInt()
  @IsEnum([10, 20, 30])
  limit: 10 | 20 | 30;
}
