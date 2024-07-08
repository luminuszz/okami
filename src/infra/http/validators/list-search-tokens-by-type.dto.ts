import { ApiProperty } from '@nestjs/swagger';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ListSearchTokensByTypeDto {
  @ApiProperty({
    enum: SearchTokenType,
  })
  @IsNotEmpty()
  @IsEnum(SearchTokenType)
  type: SearchTokenType;
}
