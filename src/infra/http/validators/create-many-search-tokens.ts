import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateSearchTokenDto } from './create-search-token.dto';

export class CreateManySearchTokensDto {
  @ApiProperty({ isArray: true, type: Array })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSearchTokenDto)
  tokens: CreateSearchTokenDto[];
}
