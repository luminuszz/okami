import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';

export class CreateSearchTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    enum: SearchTokenType,
    type: String,
    required: true,
  })
  @IsString()
  @IsEnum(SearchTokenType)
  type: SearchTokenType;
}
