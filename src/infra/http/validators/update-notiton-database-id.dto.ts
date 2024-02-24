import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotionDatabaseIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  notionDatabaseId: string;
}
