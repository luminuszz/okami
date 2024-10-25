import { Status } from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
